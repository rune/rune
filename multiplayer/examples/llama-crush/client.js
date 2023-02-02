const board = document.getElementById("board")
const framesElement = document.getElementById("frames")
const tilesElement = document.getElementById("tiles")
const turnsList = document.getElementById("turns")
const roundElement = document.getElementById("round")
const playersList = document.getElementById("players")
const hammerButton = document.getElementById("hammer-button")
const shuffleButton = document.getElementById("shuffle-button")
const popSound = new Audio("pop.m4a")
const popEchoSound = new Audio("pop-echo.mp3")
const startupSound = new Audio("startup.wav")

const playSoundSafely = (sound) => {
  try {
    sound.play()
  } catch (_e) {
    // Sounds may be blocked by browser
  }
}

let tiles, frames, playerItems, turnsItems

const getPosition = (index) => {
  const { row, col } = getCoordinatesForIndex(index)
  return { top: `${(row * 100) / rows}%`, left: `${(col * 100) / cols}%` }
}

const getCoordinatesForTouch = (touch) => {
  const boardRect = board.getBoundingClientRect()
  const col = Math.floor(((touch.pageX - boardRect.x) * cols) / boardRect.width)
  const row = Math.floor(
    ((touch.pageY - boardRect.y) * rows) / boardRect.height
  )

  if (col < 0 || col >= cols || row < 0 || row >= rows) {
    return null
  }

  return { col, row }
}

let yourTurn = false
let cells = null
let sourceCoordinates = null
let isHammering = false
let isUpdating = false

hammerButton.onclick = () => {
  if (yourTurn && !isUpdating) {
    isHammering = true
  }
}

shuffleButton.onclick = () => {
  if (yourTurn && !isUpdating) {
    Rune.actions.shuffle()
  }
}

board.ontouchstart = (e) => {
  e.stopPropagation()
  e.preventDefault()
  const [touch] = e.touches
  if (!yourTurn && !isUpdating) {
    return
  } else if (isHammering) {
    const { row, col } = getCoordinatesForTouch(touch)
    isHammering = false
    Rune.actions.remove({
      index: getIndexForCoordinates(row, col),
    })
  } else {
    sourceCoordinates = getCoordinatesForTouch(touch)
  }
}

board.ontouchmove = (e) => {
  if (!sourceCoordinates) {
    return
  }
  const targetCoordinates = getCoordinatesForTouch(e.touches[0])
  if (
    (targetCoordinates && sourceCoordinates.row !== targetCoordinates.row) ||
    sourceCoordinates.col !== targetCoordinates.col
  ) {
    // TODO: limit to neighbor tiles
    const sourceIndex = getIndexForCoordinates(
      sourceCoordinates.row,
      sourceCoordinates.col
    )
    const targetIndex = getIndexForCoordinates(
      targetCoordinates.row,
      targetCoordinates.col
    )
    sourceCoordinates = null
    const changes = swapAndMatch(cells.slice(0), sourceIndex, targetIndex)
    if (changes.length === 0) {
      return
    }
    Rune.actions.swap({
      sourceIndex,
      targetIndex,
    })
  }
}
board.ontouchend = () => {
  sourceCoordinates = null
}

const positionCellElement = (element, index) => {
  const position = getPosition(index)
  element.style.top = position.top
  element.style.left = position.left
}

const createCellElement = () => {
  const element = document.createElement("div")
  element.style.width = `${100 / rows}%`
  return element
}

const createPlayerElement = (playerIndex) => {
  const element = document.createElement("li")
  const img = document.createElement("img")
  img.setAttribute("src", "avatar.svg")
  element.appendChild(img)
  const name = document.createElement("span")
  element.appendChild(name)
  element.setAttribute("data-player", playerIndex)
  return element
}

const swapTiles = (sourceIndex, targetIndex) => {
  const sourceElement = tiles[sourceIndex]
  const targetElement = tiles[targetIndex]
  positionCellElement(sourceElement, targetIndex)
  positionCellElement(targetElement, sourceIndex)
  tiles[sourceIndex] = targetElement
  tiles[targetIndex] = sourceElement
}

const removeTile = (index) => {
  const element = tiles[index]
  element.className = "removed"
  tiles[index] = null
  setTimeout(() => {
    element.parentElement.removeChild(element)
  }, 1000)
}

const setTile = (element, tile) => {
  element.setAttribute("data-tile", tile === null ? "" : tile)
}

const addTile = (index, tile) => {
  const element = createCellElement(index)
  element.className = "added"
  setTile(element, tile)
  tiles[index] = element
  positionCellElement(element, index)
  tilesElement.appendChild(element)
  setTimeout(() => {
    element.className = ""
  }, 20)
}

const renderBoard = () => {
  tiles.forEach((element, i) => {
    const tile = cells[i]
    setTile(element, tile)
    positionCellElement(element, i)

    // Disable cell if cell is claimed or not player's turn
    if (yourTurn) {
      element.setAttribute("disabled", "disabled")
    } else {
      element.removeAttribute("disabled")
    }
  })
}

const sleep = (duration) =>
  new Promise((resolve) => setTimeout(resolve, duration))

const animateChanges = async (changes) => {
  for (let i = 0; i < changes.length; i++) {
    const { added, moved, removed } = changes[i]
    removed
      .flat()
      .filter((t, i, arr) => arr.indexOf(t) === i)
      .forEach((index) => removeTile(index))
    Object.entries(moved)
      .map(([targetIndex, sourceIndex]) => [targetIndex, tiles[sourceIndex]])
      .forEach(([targetIndex, element]) => {
        positionCellElement(element, targetIndex)
        tiles[targetIndex] = element
      })
    Object.entries(added).forEach(([index, tile]) => addTile(index, tile))
    playSoundSafely(removed.length >= 2 ? popEchoSound : popSound)
    await sleep(i === changes.length - 1 ? 500 : 800)
  }
}

const setTurnsPlayed = (turns) => {
  turnsItems.forEach((element, i) => {
    element.className = i < turns ? "filled" : ""
  })
}

const setRoundsPlayed = (roundsPlayed) => {
  roundElement.textContent = `${Math.min(
    roundsPlayed + 1,
    numberOfRounds
  )}/${numberOfRounds}`
}

const visualUpdate = async ({
  newGame,
  action,
  players: playerData,
  yourPlayerId,
}) => {
  const {
    playerIds,
    currentPlayerIndex,
    turnsPlayed,
    roundsPlayed,
    changes,
    scores,
  } = newGame
  cells = newGame.cells
  yourTurn = playerIds.indexOf(yourPlayerId) === currentPlayerIndex

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
      li.parentElement.removeChild(li)
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

  // Initialize turn list item elements if not already created
  if (!turnsItems) {
    turnsItems = new Array(turnsPerRound).fill(null).map((_, i) => {
      const li = document.createElement("li")
      turnsList.appendChild(li)
      return li
    })
  }

  const updatePlayerState = () => {
    playerIds.forEach((id, i) => {
      let li = playerItems[i]
      const player = playerData[id]
      const isCurrentPlayer = i === currentPlayerIndex
      const position =
        (i + playerIds.length - currentPlayerIndex) % playerIds.length
      li.className = isCurrentPlayer
        ? "current"
        : position === playerIds.length - 1
        ? "previous"
        : ""
      li.lastChild.textContent = player && player.displayName
      li.setAttribute("data-score", scores[id])
      li.style.left = isCurrentPlayer
        ? "50%"
        : `${((playerIds.length - position) / playerIds.length) * 100}%`
    })
    setTurnsPlayed(turnsPlayed)
    setRoundsPlayed(roundsPlayed)
    const becameYourTurn = board.className == "disabled" && yourTurn
    board.className = yourTurn ? "" : "disabled"
    if (becameYourTurn) {
      playSoundSafely(startupSound)
    }
  }

  if (action) {
    if (action.action === "swap") {
      const { sourceIndex, targetIndex } = action.params
      swapTiles(sourceIndex, targetIndex)
      await sleep(400)
    }
    setTurnsPlayed(turnsPlayed || turnsPerRound)
    await animateChanges(changes)
  }
  renderBoard()
  updatePlayerState()
}

const renderQueue = []
const queueUpdate = async (...update) => {
  renderQueue.unshift(update)
  if (!isUpdating) {
    isUpdating = true
    while (renderQueue.length !== 0) {
      await visualUpdate(...renderQueue.pop())
    }
    isUpdating = false
  }
}

Rune.initClient({ visualUpdate: queueUpdate })
