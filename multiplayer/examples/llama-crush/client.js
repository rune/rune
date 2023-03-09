const boardInner = document.getElementById("board-inner")
const board = document.getElementById("board")
const framesElement = document.getElementById("frames")
const tilesElement = document.getElementById("tiles")
const movesList = document.getElementById("moves")
const roundsList = document.getElementById("rounds")
const playersList = document.getElementById("players")
// const hammerButton = document.getElementById("hammer-button")
const shuffleButton = document.getElementById("shuffle-button")
const shufflesList = document.getElementById("shuffles")
const extraMoveButton = document.getElementById("extra-move-button")
const extraMovesList = document.getElementById("extra-moves")
const popSound = new Audio("pop.m4a")
const popEchoSound = new Audio("pop-echo.mp3")
const startupSound = new Audio("startup.wav")

let resizeTimer = null

const resizeObserver = new ResizeObserver(() => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(
    () => {
      board.style.width = `${Math.min(
        boardInner.scrollHeight,
        boardInner.scrollWidth
      )}px`
      resizeTimer = null
    },
    resizeTimer ? 200 : 0
  )
})

resizeObserver.observe(boardInner)

const playSoundSafely = (sound) => {
  try {
    sound.play()
  } catch (_e) {
    // Sounds may be blocked by browser
  }
}

let tiles,
  frames,
  playerItems,
  roundsItems,
  shufflesItems,
  extraMovesItems,
  movesItems = []

const getPosition = (index) => {
  const { row, col } = getCoordinatesForIndex(index)
  return { top: `${(row * 100) / rows}%`, left: `${(col * 100) / cols}%` }
}

const getCoordinatesForEvent = (e) => {
  const boardRect = board.getBoundingClientRect()
  const col = Math.floor(((e.pageX - boardRect.x) * cols) / boardRect.width)
  const row = Math.floor(((e.pageY - boardRect.y) * rows) / boardRect.height)

  if (col < 0 || col >= cols || row < 0 || row >= rows) {
    return null
  }

  return { col, row }
}

let yourTurn = false
let cells = null
let sourceCoordinates = null
// let isHammering = false
let isUpdating = false

// hammerButton.onclick = () => {
//   if (yourTurn && !isUpdating) {
//     isHammering = true
//   }
// }

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

const handlePointerStart = (coordinates) => {
  if (!yourTurn || isUpdating) {
    return
  }
  sourceCoordinates = coordinates
  // if (yourTurn && isHammering) {
  //   const { row, col } = getCoordinatesForEvent(e)
  //   isHammering = false
  //   Rune.actions.remove({
  //     index: getIndexForCoordinates(row, col),
  //   })
  // }
}

const handlePointerMove = (coordinates) => {
  if (!sourceCoordinates) {
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
  if (!yourTurn) {
    const coordinates = getCoordinatesForEvent(e)
    Rune.actions.highlight({
      index: getIndexForCoordinates(coordinates.row, coordinates.col),
    })
  }
}

const deltaToDirection = {
  [-1]: "left",
  1: "right",
  [-cols]: "up",
  [cols]: "down",
}
async function renderInvalidMove(index1, index2) {
  isUpdating = true
  ;[
    [index1, index2],
    [index2, index1],
  ].forEach(([index1, index2]) => {
    tiles[index1].className = `invalid-move-${
      deltaToDirection[index2 - index1]
    }`
  })
  await sleep(600)
  tiles[index1].className = ""
  tiles[index2].className = ""
  isUpdating = false
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
  element.appendChild(document.createElement("img"))
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
  element.classList.add("removed")
  tiles[index] = null
  setTimeout(() => {
    element.parentElement.removeChild(element)
  }, 1000)
}

const setMatchedTile = (index) => {
  tiles[index].classList.add("matched")
}

const setTile = (element, tile) => {
  element.setAttribute("data-tile", tile === null ? "" : tile)
  element.classList.remove("matched")
}

const setMergedTile = (element, tile, isVertical = false) => {
  element.classList.toggle("vertical", isVertical)
  element.setAttribute("data-merged-tile", tile === null ? "" : tile)
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
    element.removeAttribute("data-merged-tile")
  })
}

const sleep = (duration) =>
  new Promise((resolve) => setTimeout(resolve, duration))

const animateChanges = async (changes) => {
  for (let i = 0; i < changes.length; i++) {
    const { added, moved, removed, merged, cleared, message } = changes[i]
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
            () => element.classList.add("cleared"),
            type === 3 ? 200 : Math.abs(startNr - nr) * 25
          )
        })
      })
      await sleep(350)
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
        setMergedTile(tiles[index], tile, vertical)
        indices.forEach((i) => {
          positionCellElement(tiles[i], index)
          removeTile(i)
        })
      })
      await sleep(merged.length === 0 ? 250 : 350)
    }
    movedEntries
      .map(([targetIndex, sourceIndex]) => [targetIndex, tiles[sourceIndex]])
      .forEach(([targetIndex, element]) => {
        positionCellElement(element, targetIndex)
        tiles[targetIndex] = element
      })
    Object.entries(added).forEach(([index, tile]) => addTile(index, tile))
    playSoundSafely(removed.length >= 2 ? popEchoSound : popSound)
    await sleep(i === changes.length - 1 ? 300 : 500)
  }
}

const setFilled = (items, filledCount, useCurrent = true) =>
  items.forEach((element, i) => {
    element.className =
      i < filledCount
        ? "filled"
        : i === filledCount && useCurrent
        ? "current"
        : ""
  })

const setMovesPlayed = (movesPlayed, movesPerRound, useCurrent = true) => {
  // Initialize turn list item elements if not already created
  let extraMovesItems = []
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
      element.parentElement.removeChild(element)
    })
  }
  setFilled(movesItems, movesPlayed, useCurrent)
  movesList.setAttribute(
    "title",
    `Move ${Math.min(movesPlayed + 1, movesPerRound)}/${movesPerRound}`
  )
  extraMovesItems.forEach((element) => {
    element.classList.add("extra")
  })
}

const setRoundsPlayed = (roundsPlayed) => {
  setFilled(roundsItems, roundsPlayed)
  roundsList.setAttribute(
    "data-round",
    Math.min(numberOfRounds, roundsPlayed + 1)
  )
}

const appendNewElements = (elementCount, targetElement, tagName) =>
  new Array(elementCount).fill(null).map((_, i) => {
    const child = document.createElement(tagName)
    targetElement.appendChild(child)
    return child
  })

const showMessage = async (messageType) => {
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

const visualUpdate = async ({
  newGame,
  oldGame,
  action,
  players: playerData,
  yourPlayerId,
}) => {
  const {
    playerIds,
    currentPlayerIndex,
    movesPlayed,
    movesPerRound,
    roundsPlayed,
    changes,
    players,
    highlightedCells,
  } = newGame
  cells = newGame.cells
  const gameOver = isGameOver(newGame)
  yourTurn = !gameOver && playerIds.indexOf(yourPlayerId) === currentPlayerIndex

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

  roundsItems ||= appendNewElements(numberOfRounds, roundsList, "li")
  shufflesItems ||= appendNewElements(
    numberOfSpecialActions,
    shufflesList,
    "li"
  )
  extraMovesItems ||= appendNewElements(
    numberOfSpecialActions,
    extraMovesList,
    "li"
  )

  const updatePlayerState = async () => {
    const leaderPlayerId = playerIds.reduce(
      (a, b) => (players[a].score < players[b].score ? b : a),
      playerIds[0]
    )
    playerIds.forEach((id, i) => {
      let li = playerItems[i]
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
      li.lastChild.textContent =
        id === yourPlayerId ? "You" : player && player.displayName
      li.firstChild.setAttribute("src", player.avatarUrl)
      li.setAttribute("data-score", players[id].score)
      li.style.left = isCurrentPlayer
        ? "50%"
        : `${((playerIds.length - position) / playerIds.length) * 100}%`
    })
    const { shufflesRemaining, extraMovesRemaining } =
      players[playerIds[currentPlayerIndex]]
    setFilled(shufflesItems, shufflesRemaining)
    setFilled(extraMovesItems, extraMovesRemaining)
    shuffleButton.className =
      shufflesRemaining > 0 && yourTurn ? "" : "disabled"
    extraMoveButton.className =
      extraMovesRemaining > 0 && yourTurn ? "" : "disabled"
    setMovesPlayed(movesPlayed, movesPerRound)
    setRoundsPlayed(roundsPlayed)

    const becameYourTurn =
      document.body.className !== "current-player-turn" && yourTurn
    if (becameYourTurn) {
      document.body.className = ""
      playSoundSafely(startupSound)
      await showMessage("your-turn")
    }
    document.body.className = yourTurn ? "current-player-turn" : ""
  }

  frames.forEach((frame, i) => {
    frame.setAttribute(
      "data-highlight",
      highlightedCells[i] ? playerIds.indexOf(highlightedCells[i]) : ""
    )
  })

  if (action) {
    switch (action.action) {
      case "swap": {
        const { sourceIndex, targetIndex } = action.params
        swapTiles(sourceIndex, targetIndex)
        await sleep(400)
        if (!movesPlayed) {
          setMovesPlayed(oldGame.movesPerRound, oldGame.movesPerRound, false)
        } else {
          setMovesPlayed(movesPlayed, movesPerRound, false)
        }
        break
      }
      case "extraMove": {
        await showMessage("extra-move")
        break
      }
      case "shuffle": {
        await showMessage("shuffle")
        break
      }
    }
    await animateChanges(changes)
  }
  renderBoard()
  await updatePlayerState()
  if (
    roundsPlayed === numberOfRounds - 1 &&
    oldGame.roundsPlayed !== roundsPlayed
  ) {
    await showMessage("last-round")
  } else if (gameOver) {
    Rune.showGameOverPopUp()
  }
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
