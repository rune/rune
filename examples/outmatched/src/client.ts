import type { OnChange } from "rune-sdk/multiplayer"
import type { BoardChange, Cells, GameActions, GameState } from "./types"
import {
  rows,
  cols,
  numberOfTiles,
  startingMovesPerRound,
  numberOfRounds,
  numberOfSpecialActions,
} from "./logic/config"
import { getScoreForChange, isGameOver, isValidMove } from "./logic/game"
import {
  areCellsNeighbors,
  getCoordinatesForIndex,
  getIndexForCoordinates,
} from "./logic/board"
import { playSound } from "./sounds"

const boardInner = document.getElementById("board-inner")
const board = document.getElementById("board")
const framesElement = document.getElementById("frames")
const tilesElement = document.getElementById("tiles")
const moveHintElement = document.getElementById("move-hint")
const movesList = document.getElementById("moves")
const roundsList = document.getElementById("rounds")
const playersList = document.getElementById("players")
const shuffleButton = document.getElementById("shuffle-button")
const shufflesList = document.getElementById("shuffles")
const extraMoveButton = document.getElementById("extra-move-button")
const extraMovesList = document.getElementById("extra-moves")
const body = document.getElementsByTagName("body")[0]
const canvas = document.createElement("canvas")
body.appendChild(canvas)
const ctx = canvas.getContext("2d")

if (
  !board ||
  !boardInner ||
  !framesElement ||
  !tilesElement ||
  !moveHintElement ||
  !movesList ||
  !roundsList ||
  !playersList ||
  !shuffleButton ||
  !shufflesList ||
  !extraMoveButton ||
  !extraMovesList ||
  !body ||
  !ctx
) {
  throw new Error("Missing required HTML elements")
}

const style = document.createElement("style")
style.type = "text/css"
document.getElementsByTagName("head")[0].appendChild(style)

let resizeTimer: ReturnType<typeof setTimeout> | undefined

const resizeObserver = new ResizeObserver(() => {
  canvas.width = window.innerWidth * window.devicePixelRatio
  canvas.height = window.innerHeight * window.devicePixelRatio
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(
    () => {
      const boardWidth =
        Math.floor(
          Math.min(boardInner.clientHeight, boardInner.clientWidth) / rows
        ) * rows
      board.style.width = `${boardWidth}px`
      if (style.sheet?.rules.length !== 0) {
        style.sheet?.deleteRule(0)
      }
      style.sheet?.insertRule(
        `#frames > *, #tiles > * { width: ${boardWidth / rows}px; }`,
        0
      )
      resizeTimer = undefined
    },
    resizeTimer ? 200 : 0
  )
})

resizeObserver.observe(boardInner)

interface Coordinates {
  row: number
  col: number
}

let tiles: (HTMLElement | null)[],
  frames: HTMLElement[],
  playerItems: HTMLElement[],
  roundsItems: HTMLElement[],
  shufflesItems: HTMLElement[],
  extraMovesItems: HTMLElement[],
  movesItems: HTMLElement[] = []
const scores: number[] = []

const getCoordinatesForEvent = (e: MouseEvent | Touch) => {
  const boardRect = board.getBoundingClientRect()
  const col = Math.floor(((e.pageX - boardRect.x) * cols) / boardRect.width)
  const row = Math.floor(((e.pageY - boardRect.y) * rows) / boardRect.height)

  if (col < 0 || col >= cols || row < 0 || row >= rows) {
    return null
  }

  return { col, row }
}

let yourTurn = false
let cells: Cells
let sourceCoordinates: Coordinates | null = null
let isUpdating = false

shuffleButton.onclick = () => {
  if (yourTurn && !isUpdating) {
    Rune.actions.shuffle()
  }
}

extraMoveButton.onclick = () => {
  if (yourTurn && !isUpdating) {
    Rune.actions.extraMove()
  }
}

const handlePointerStart = (coordinates: Coordinates | null) => {
  if (!yourTurn || isUpdating) {
    return
  }
  sourceCoordinates = coordinates
}

const handlePointerMove = (coordinates: Coordinates | null) => {
  if (!sourceCoordinates || !coordinates) {
    return
  }
  if (
    (coordinates && sourceCoordinates.row !== coordinates.row) ||
    sourceCoordinates.col !== coordinates.col
  ) {
    const sourceIndex = getIndexForCoordinates(
      sourceCoordinates.row,
      sourceCoordinates.col
    )
    const targetIndex = getIndexForCoordinates(coordinates.row, coordinates.col)
    sourceCoordinates = null
    if (isValidMove(cells, sourceIndex, targetIndex)) {
      Rune.actions.swap({
        sourceIndex,
        targetIndex,
      })
    } else if (areCellsNeighbors(sourceIndex, targetIndex)) {
      renderInvalidMove(sourceIndex, targetIndex)
      playSound("swap")
    }
  }
}

const handlePointerEnd = () => {
  sourceCoordinates = null
}

board.ontouchstart = (e) =>
  handlePointerStart(getCoordinatesForEvent(e.touches[0]))

board.onmousedown = (e) => handlePointerStart(getCoordinatesForEvent(e))

board.ontouchmove = (e) =>
  handlePointerMove(getCoordinatesForEvent(e.touches[0]))

board.onmousemove = (e) => handlePointerMove(getCoordinatesForEvent(e))

board.onmouseup = board.ontouchend = handlePointerEnd

board.onclick = (e) => {
  const coordinates = getCoordinatesForEvent(e)
  if (isUpdating || !coordinates) {
    return
  }
  const index = getIndexForCoordinates(coordinates.row, coordinates.col)
  if (!yourTurn) {
    Rune.actions.highlight({ index })
  } else if (cells[index] > numberOfTiles) {
    showSpecialTileHint(index)
  }
}

const deltaToDirection = {
  [-1]: "left",
  1: "right",
  [-cols]: "up",
  [cols]: "down",
}
async function renderInvalidMove(index1: number, index2: number) {
  isUpdating = true
  ;[
    [index1, index2],
    [index2, index1],
  ].forEach(([index1, index2]) => {
    tiles[index1]!.className = `invalid-move-${
      deltaToDirection[index2 - index1]
    }`
  })
  await sleep(600)
  tiles[index1]!.className = ""
  tiles[index2]!.className = ""
  isUpdating = false
}

const positionCellElement = (element: HTMLElement, index: number) => {
  const { row, col } = getCoordinatesForIndex(index)
  element.style.transform = `translate(${Math.abs(col) * 100}%, ${row * 100}%)`
}

const createCellElement = () => document.createElement("div")

const createPlayerElement = (playerIndex: number) => {
  const element = document.createElement("li")
  element.appendChild(document.createElement("img"))
  const name = document.createElement("span")
  element.appendChild(name)
  element.setAttribute("data-player", playerIndex.toString())
  return element
}

const swapTiles = (sourceIndex: number, targetIndex: number) => {
  const sourceElement = tiles[sourceIndex]!
  const targetElement = tiles[targetIndex]!
  positionCellElement(sourceElement, targetIndex)
  positionCellElement(targetElement, sourceIndex)
  tiles[sourceIndex] = targetElement
  tiles[targetIndex] = sourceElement
}

const removeTile = (index: number) => {
  const element = tiles[index]
  element?.classList.add("removed")
  tiles[index] = null
  setTimeout(() => {
    element?.parentElement?.removeChild(element)
  }, 1000)
}

const easeInOut = (n: number) => 1 - (Math.cos(Math.PI * n) + 1) / 2

const tween = (from: number, to: number, progress: number) =>
  from + (to - from) * progress

const particleColors = [
  "#69D2E7",
  "#A7DBD8",
  "#E0E4CC",
  "#F38630",
  "#FA6900",
  "#FF4E50",
  "#F9D423",
]

interface Particle {
  x: number
  y: number
  radius: number
  wander: number
  theta: number
  drag: number
  color: string
  vx: number
  vy: number
}

const particles: Particle[] = []

const spawnParticle = function (x: number, y: number, radius: number) {
  particles.push({
    x,
    y,
    radius,
    wander: 0.13,
    theta: Math.random() * Math.PI * 2,
    drag: 0.82,
    color: particleColors[Math.floor(Math.random() * particleColors.length)],
    vx: 0,
    vy: 0,
  })
}

const moveParticles = function () {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]

    if (p.radius < 0.5) {
      particles.splice(i, 1)
    } else {
      p.x += p.vx
      p.y += p.vy

      p.vx *= p.drag
      p.vy *= p.drag

      p.theta += (Math.random() - 0.5) * p.wander
      p.vx += Math.sin(p.theta) * 0.1
      p.vy += Math.cos(p.theta) * 0.1

      p.radius *= 0.95
    }
  }
}

const drawParticles = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.globalCompositeOperation = "lighter"

  for (let i = particles.length - 1; i >= 0; i--) {
    const { x, y, radius, color } = particles[i]
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  }
}

const animateScore = (indices: number[], playerIndex: number, scoreDelta = 0) =>
  new Promise((resolve) => {
    const [avatarRect] =
      (playerItems[playerIndex]?.firstChild as HTMLElement)?.getClientRects() ||
      []

    if (!avatarRect) {
      throw new Error("AvatarRect not found")
    }

    const target = {
      left: Math.round(avatarRect.left + avatarRect.width) - 5,
      top: Math.round(avatarRect.top) + 10,
    }
    const sources = indices.map((index) => {
      const [tileRect] = frames[index].getClientRects()
      return {
        left: Math.round(tileRect.left + tileRect.width / 2),
        top: Math.round(tileRect.top + tileRect.height / 2),
      }
    })

    const duration = 400
    const particleFrames = 100
    let lastParticleFrame = 0
    const start = performance.now()
    const frameSize = canvas.width / cols / window.devicePixelRatio
    const addParticles = () => {
      const currentParticleFrame =
        particleFrames *
        (Math.min(duration, performance.now() - start) / duration)
      for (
        let i = lastParticleFrame;
        i < currentParticleFrame || (i === 0 && lastParticleFrame === 0);
        i++
      ) {
        const progress = i / particleFrames

        const easedProgress = easeInOut(progress)

        sources.forEach((source) => {
          const radius = frameSize * (0.1 + (1 - progress) * 0.15)
          const x = tween(
            source.left,
            target.left,
            Math.pow(easedProgress, 0.7)
          )
          const y = tween(source.top, target.top, easedProgress)
          spawnParticle(x, y, radius)
        })
      }
      lastParticleFrame = currentParticleFrame
      if (currentParticleFrame < particleFrames) {
        requestAnimationFrame(addParticles)
      } else {
        scores[playerIndex] += scoreDelta
        playerItems[playerIndex].setAttribute(
          "data-score",
          scores[playerIndex].toString()
        )
        resolve(null)
      }
    }
    addParticles()
    const step = () => {
      drawParticles()
      if (particles.length > 0) {
        moveParticles()
        requestAnimationFrame(step)
      }
    }
    step()
  })

const setMatchedTile = (index: number) => {
  tiles[index]?.classList.add("matched")
}

const setTile = (element: HTMLElement, tile: number | null) => {
  element.setAttribute("data-tile", tile === null ? "" : tile.toString())
  element.classList.remove("matched")
}

const setMergedTile = (
  element: HTMLElement,
  tile: number | null,
  isVertical = false
) => {
  element.classList.toggle("vertical", isVertical)
  element.setAttribute("data-merged-tile", tile === null ? "" : tile.toString())
}

const addTile = (index: number, tile: number) => {
  const element = createCellElement()
  setTile(element, tile)
  tiles[index] = element
  const { col } = getCoordinatesForIndex(index)
  element.style.transform = `translate(${col * 100}%, -100%)`
  tilesElement.appendChild(element)
  setTimeout(() => {
    positionCellElement(element, index)
  }, 20)
}

const renderBoard = () => {
  tiles.forEach((element, i) => {
    if (!element) {
      return
    }
    const tile = cells[i]
    setTile(element, tile)
    positionCellElement(element, i)
    element.removeAttribute("data-merged-tile")
    element.removeAttribute("data-swap-player")
  })
}

const sleep = (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration))

const pickIndices = (array: { index: number; indices: number[] }[]) =>
  array.map(({ index, indices }) => indices.concat(index))

const animateChanges = async (changes: BoardChange[], playerIndex: number) => {
  for (let i = 0; i < changes.length; i++) {
    const change = changes[i]
    const { added, moved, removed, merged, cleared, message } = change
    if (message) {
      await showMessage(message)
    }
    const movedEntries = Object.entries(moved)
    if (removed.length || merged.length || cleared.length) {
      removed
        .concat(merged.map((m) => m.indices.concat(m.index)))
        .flat()
        .forEach((index) => setMatchedTile(index))
      cleared.forEach(({ index, tile, indices }) => {
        const type = Math.floor((tile - 1) / numberOfTiles)
        const startNr = indices.indexOf(index)
        indices.forEach((i, nr) => {
          const element = tiles[i]
          setTimeout(
            () => element?.classList.add("cleared"),
            type === 3 ? 200 : Math.abs(startNr - nr) * 25
          )
        })
      })

      if (removed.length || merged.length) {
        playSound(i === 0 ? "match-1" : i === 1 ? "match-2" : "match-3")
      }

      if (
        cleared.find(({ tile }) => Math.floor((tile - 1) / numberOfTiles) !== 3)
      ) {
        playSound("arrow")
      }

      await sleep(350)
      animateScore(
        removed.concat(pickIndices(merged)).concat(pickIndices(cleared)).flat(),
        playerIndex,
        getScoreForChange(change)
      )

      if (
        cleared.find(({ tile }) => Math.floor((tile - 1) / numberOfTiles) === 3)
      ) {
        playSound("bomb")
      }

      if (merged.find(({ indices }) => indices.length === 4)) {
        playSound("match-bomb")
      } else if (merged.length) {
        playSound("match-arrow")
      }

      removed
        .concat(cleared.map((c) => c.indices))
        .flat()
        .filter(
          (t, i, arr) =>
            arr.indexOf(t) === i &&
            !merged.find(
              ({ index, indices }) => t === index || indices.includes(t)
            )
        )
        .forEach((index) => removeTile(index))
      merged.forEach(({ index, tile, indices, vertical }) => {
        setMergedTile(tiles[index]!, tile, vertical)
        indices.forEach((i) => {
          positionCellElement(tiles[i]!, index)
          removeTile(i)
        })
      })
      await sleep(merged.length === 0 ? 250 : 350)
    }
    movedEntries
      .map(
        ([targetIndex, sourceIndex]) =>
          [parseInt(targetIndex, 10), tiles[sourceIndex]] as const
      )
      .forEach(([targetIndex, element]) => {
        positionCellElement(element!, targetIndex)
        tiles[targetIndex] = element
      })
    Object.entries(added).forEach(([index, tile]) =>
      addTile(parseInt(index, 10), tile)
    )
    await sleep(i === changes.length - 1 ? 300 : 500)
  }
}

const setFilled = (
  items: HTMLElement[],
  filledCount: number,
  useCurrent = true
) =>
  items.forEach((element, i) => {
    element.className =
      i < filledCount
        ? "filled"
        : i === filledCount && useCurrent
          ? "current"
          : ""
  })

const setMovesPlayed = (
  movesPlayed: number,
  movesPerRound: number,
  useCurrent = true
) => {
  // Initialize turn list item elements if not already created
  let extraMovesItems: HTMLElement[] = []
  if (movesPerRound > movesItems.length) {
    const numToInsert = movesPerRound - movesItems.length
    movesItems = movesItems.concat(
      appendNewElements(numToInsert, movesList, "li")
    )
    if (movesPerRound > startingMovesPerRound) {
      extraMovesItems = movesItems.slice(
        Math.max(startingMovesPerRound, movesItems.length - numToInsert)
      )
    }
  } else if (movesPerRound < movesItems.length) {
    movesItems.splice(movesPerRound).forEach((element) => {
      element.parentElement?.removeChild(element)
    })
  }
  setFilled(movesItems, movesPlayed, useCurrent)
  const movesLeft = movesPerRound - movesPlayed
  movesList.setAttribute(
    "title",
    `${movesLeft} Move${movesLeft === 1 ? "" : "s"} Left`
  )
  extraMovesItems.forEach((element) => {
    element.classList.add("extra")
  })
}

const setRoundsPlayed = (roundsPlayed: number) => {
  setFilled(roundsItems, roundsPlayed)
  roundsList.setAttribute(
    "data-round",
    Math.min(numberOfRounds, roundsPlayed + 1).toString()
  )
}

const appendNewElements = (
  elementCount: number,
  targetElement: HTMLElement,
  tagName: string
) =>
  new Array(elementCount).fill(null).map(() => {
    const child = document.createElement(tagName)
    targetElement.appendChild(child)
    return child
  })

const showMessage = async (messageType: string) => {
  const messageElement = document.createElement("div")
  const innerMessageElement = document.createElement("span")
  switch (messageType) {
    case "extra-move":
      innerMessageElement.textContent = "Extra Move!"
      break
    case "out-of-moves":
      innerMessageElement.textContent = "Out of Moves!"
      break
    case "your-turn":
      innerMessageElement.textContent = "Your Turn!"
      break
    case "last-round":
      innerMessageElement.textContent = "Last Round!"
      break
    case "shuffle":
      innerMessageElement.textContent = "Shuffle!"
      break
    default:
      throw new Error(`Invalid message type "${messageType}"`)
  }
  innerMessageElement.className = messageType
  messageElement.className = "message"
  messageElement.appendChild(innerMessageElement)
  board.appendChild(messageElement)
  await sleep(1500)
  board.removeChild(messageElement)
}

async function showSpecialTileHint(index: number) {
  const { row, col } = getCoordinatesForIndex(index)
  isUpdating = true

  const messageElement = document.createElement("div")
  messageElement.textContent = "Match me with the same color!"
  messageElement.className = `tooltip ${
    index % cols > cols / 2 ? "left" : "right"
  }`
  messageElement.style.top = `${(row / rows) * 100}%`
  messageElement.style.left = `${(col / cols) * 100}%`
  board?.appendChild(messageElement)

  const sameColorFrames = frames.filter(
    (_, i) => cells[i] % numberOfTiles === cells[index] % numberOfTiles
  )
  sameColorFrames.forEach((element) => {
    element.classList.add("hint")
  })
  await sleep(2000)
  sameColorFrames.forEach((element) => {
    element.classList.remove("hint")
  })
  board?.removeChild(messageElement)
  isUpdating = false
}

function findPossibleMoves(cells: Cells) {
  const moves = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const index = getIndexForCoordinates(row, col)
      if (isValidMove(cells, index, index + 1)) {
        moves.push([index, index + 1])
      }
      if (isValidMove(cells, index, index + cols)) {
        moves.push([index, index + cols])
      }
    }
  }
  return moves
}

async function showHint(playerIndex: number) {
  const moves = findPossibleMoves(cells)
  const [index1, index2] = moves[Math.floor(Math.random() * moves.length)]
  const direction = deltaToDirection[index2 - index1]
  const { row, col } = getCoordinatesForIndex(index1)
  if (!moveHintElement) {
    return
  }
  moveHintElement.style.top = `${(row / rows) * 100}%`
  moveHintElement.style.left = `${(col / cols) * 100}%`
  moveHintElement.style.width = `${(1 / cols) * 100}%`
  moveHintElement.setAttribute("data-swap-player", (playerIndex + 1).toString())
  moveHintElement.className = `move-${direction}`
  await sleep(1500)
  moveHintElement.className = ""
  moveHintElement.removeAttribute("data-swap-player")
}

let hintInterval: ReturnType<typeof setTimeout> | undefined

function scheduleMoveHint(playerIndex: number) {
  hintInterval = setInterval(() => {
    showHint(playerIndex)
  }, 20000)
}

type OnChangeFn = OnChange<GameState, GameActions>
type OnChangeParam = Parameters<OnChangeFn>[0]
const onChange: OnChangeFn = async ({
  game,
  previousGame,
  action,
  players: playerData,
  yourPlayerId,
}) => {
  clearTimeout(hintInterval)
  const {
    playerIds,
    currentPlayerIndex,
    movesPlayed,
    movesPerRound,
    roundsPlayed,
    changes,
    players,
    highlightedCells,
  } = game
  cells = game.cells
  const gameOver = isGameOver(game)
  yourTurn =
    !gameOver && yourPlayerId
      ? playerIds.indexOf(yourPlayerId) === currentPlayerIndex
      : false

  // Initialize frame elements if not already created
  if (!frames) {
    frames = cells.map((_, cellIndex) => {
      const element = createCellElement()
      positionCellElement(element, cellIndex)
      framesElement.appendChild(element)
      return element
    })
  }

  // Initialize tile elements if not already created
  if (!tiles) {
    tiles = cells.map((_, cellIndex) => {
      const element = createCellElement()
      positionCellElement(element, cellIndex)
      tilesElement.appendChild(element)
      return element
    })
  }

  // Initialize player list item elements if not already created
  if (!playerItems) {
    playerItems = playerIds.map((_, i) => {
      const element = createPlayerElement(i)
      playersList.appendChild(element)
      return element
    })
  } else if (playerItems.length > playerIds.length) {
    playerItems.splice(playerIds.length).forEach((li) => {
      li.parentElement?.removeChild(li)
    })
  } else if (playerItems.length < playerIds.length) {
    playerItems = playerItems.concat(
      new Array(playerIds.length - playerItems.length)
        .fill(null)
        .map((_, i) => {
          const element = createPlayerElement(i)
          playersList.appendChild(element)
          return element
        })
    )
  }

  roundsItems =
    roundsItems || appendNewElements(numberOfRounds, roundsList, "li")
  shufflesItems =
    shufflesItems ||
    appendNewElements(numberOfSpecialActions, shufflesList, "li")
  extraMovesItems =
    extraMovesItems ||
    appendNewElements(numberOfSpecialActions, extraMovesList, "li")

  const updatePlayerState = async (currentPlayerIndex: number) => {
    const leaderPlayerId = playerIds.reduce(
      (a, b) => (players[a].score < players[b].score ? b : a),
      playerIds[0]
    )
    playerIds.forEach((id, i) => {
      const li = playerItems[i]
      const player = playerData[id]
      const isCurrentPlayer = i === currentPlayerIndex
      const position =
        (i + playerIds.length - currentPlayerIndex) % playerIds.length
      const wasLeader = li.classList.contains("leader")
      li.className = isCurrentPlayer ? "current" : ""
      if (id === leaderPlayerId) {
        li.classList.add("leader")
      } else if (wasLeader) {
        li.classList.add("previous-leader")
      }
      li.lastChild!.textContent =
        id === yourPlayerId ? "You" : player && player.displayName
      ;(li.firstChild as HTMLElement).setAttribute("src", player.avatarUrl)
      li.setAttribute("data-score", players[id].score.toString())
      scores[i] = players[id].score
      li.style.left = isCurrentPlayer
        ? "50%"
        : `${((playerIds.length - position) / playerIds.length) * 100}%`
    })

    const { shufflesRemaining, extraMovesRemaining } =
      players[yourPlayerId || playerIds[currentPlayerIndex]]
    setFilled(shufflesItems, shufflesRemaining)
    setFilled(extraMovesItems, extraMovesRemaining)
    shuffleButton.className =
      shufflesRemaining > 0 && yourTurn ? "" : "disabled"
    extraMoveButton.className =
      extraMovesRemaining > 0 && yourTurn ? "" : "disabled"
    setMovesPlayed(movesPlayed, movesPerRound)
    setRoundsPlayed(roundsPlayed)

    const becameYourTurn = body.className !== "current-player-turn" && yourTurn
    if (becameYourTurn) {
      body.className = ""
      playSound("your-turn")
      await showMessage("your-turn")
      if (roundsPlayed === 0) {
        await sleep(300)
        showHint(currentPlayerIndex)
      }
    }
    body.className = yourTurn ? "current-player-turn" : ""
  }

  frames.forEach((frame, i) => {
    frame.setAttribute(
      "data-highlight",
      highlightedCells[i]
        ? playerIds.indexOf(highlightedCells[i]).toString()
        : ""
    )
  })

  if (action) {
    switch (action.name) {
      case "swap": {
        const { sourceIndex, targetIndex } = action.params
        const sourceElement = tiles[sourceIndex]
        if (
          yourPlayerId &&
          previousGame.playerIds.indexOf(yourPlayerId) !==
            previousGame.currentPlayerIndex
        ) {
          sourceElement?.setAttribute(
            "data-swap-player",
            (previousGame.currentPlayerIndex + 1).toString()
          )
          await sleep(300)
        }

        swapTiles(sourceIndex, targetIndex)
        playSound("swap")
        await sleep(400)
        if (!movesPlayed) {
          setMovesPlayed(
            previousGame.movesPerRound,
            previousGame.movesPerRound,
            false
          )
          await sleep(400)
        } else {
          setMovesPlayed(movesPlayed, movesPerRound, false)
        }

        break
      }
      case "extraMove": {
        playSound("extra-move")
        await showMessage("extra-move")
        break
      }
      case "shuffle": {
        await showMessage("shuffle")
        playSound("shuffle")
        break
      }
    }
    await animateChanges(changes, previousGame.currentPlayerIndex)
  }
  renderBoard()
  await updatePlayerState(currentPlayerIndex)
  if (
    roundsPlayed === numberOfRounds - 1 &&
    previousGame.roundsPlayed !== roundsPlayed
  ) {
    await showMessage("last-round")
  } else if (gameOver) {
    Rune.showGameOverPopUp()
  }
  if (yourTurn) {
    scheduleMoveHint(currentPlayerIndex)
  }
}

const renderQueue: OnChangeParam[] = []
const queueUpdate: OnChangeFn = async (update) => {
  renderQueue.unshift(update)
  if (!isUpdating) {
    isUpdating = true
    let params: OnChangeParam | undefined
    while ((params = renderQueue.pop())) {
      await onChange(params)
    }
    isUpdating = false
  }
}

Rune.initClient({ onChange: queueUpdate })
