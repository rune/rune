const getConfig = () => ({
  rows: 7,
  cols: 7,
  numberOfTiles: 6,
  startingMovesPerRound: 2,
  numberOfRounds: 5,
  numberOfSpecialActions: 3,
})
const {
  rows,
  cols,
  numberOfTiles,
  startingMovesPerRound,
  numberOfRounds,
  numberOfSpecialActions,
} = getConfig()

const getRandomTile = () => Math.ceil(Math.random() * numberOfTiles)

function getCoordinatesForIndex(index) {
  const row = Math.floor(index / cols)
  const col = index % cols
  return { row, col }
}

const areCoordinatesValid = (row, col) =>
  row >= 0 && row < rows && col >= 0 && col < cols

function getIndexForCoordinates(row, col) {
  if (!areCoordinatesValid(row, col)) {
    throw new Error("Out of bounds")
  }
  return row * cols + col
}

function areCellsNeighbors(index1, index2) {
  const colDelta = Math.abs(index1 - index2)
  return (
    ((colDelta === 1 &&
      Math.floor(index1 / cols) === Math.floor(index2 / cols)) ||
      (colDelta === cols && index1 % cols === index2 % cols)) &&
    Math.min(index1, index2) >= 0 &&
    Math.max(index1, index2) < cols * rows
  )
}

function seekMatchBoundary(cells, originIndex, step, shouldSeekHorizontally) {
  const { cols } = getConfig()
  let current = originIndex
  while (true) {
    const next = current + step
    if (
      (shouldSeekHorizontally
        ? Math.floor(next / cols) === Math.floor(originIndex / cols)
        : next % cols === originIndex % cols) &&
      next in cells &&
      cells[next] === cells[originIndex]
    ) {
      current = next
    } else {
      break
    }
  }
  return current
}

function seekMatch3(cells, originIndex, shouldSeekHorizontally) {
  const stepSize = shouldSeekHorizontally ? 1 : getConfig().cols
  let startIndex = seekMatchBoundary(
    cells,
    originIndex,
    0 - stepSize,
    shouldSeekHorizontally
  )
  let endIndex = seekMatchBoundary(
    cells,
    originIndex,
    stepSize,
    shouldSeekHorizontally
  )
  const matchCount = (endIndex - startIndex) / stepSize + 1
  return matchCount >= 3
}

function isValidMove(cells, index1, index2) {
  if (!areCellsNeighbors(index1, index2)) {
    return false
  }
  const swapped = swapIndices(cells.slice(0), index1, index2)
  return (
    seekMatch3(swapped, index1, false) ||
    seekMatch3(swapped, index1, true) ||
    seekMatch3(swapped, index2, false) ||
    seekMatch3(swapped, index2, true)
  )
}

function hasValidMoves(cells) {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const index = getIndexForCoordinates(row, col)
      if (
        isValidMove(cells, index, index + 1) ||
        isValidMove(cells, index, index + cols)
      ) {
        return true
      }
    }
  }
  return false
}

function match3(cells) {
  const clusters = []
  for (let row = 0; row < rows; row++) {
    let cluster = []
    for (let col = 0; col < cols; col++) {
      const index = getIndexForCoordinates(row, col)
      if (cluster.length !== 0 && cells[cluster[0]] !== cells[index]) {
        cluster = []
      }
      cluster.push(index)
      if (cluster.length === 3) {
        clusters.push(cluster)
      }
    }
  }

  for (let col = 0; col < cols; col++) {
    let cluster = []
    for (let row = 0; row < rows; row++) {
      const index = getIndexForCoordinates(row, col)
      if (cluster.length !== 0 && cells[cluster[0]] !== cells[index]) {
        cluster = []
      }
      cluster.push(index)
      if (cluster.length === 3) {
        clusters.push(cluster)
      }
    }
  }
  return clusters
}

function removeIndices(cells, indices) {
  const moved = {}
  for (let index of indices) {
    let current = index
    while (true) {
      const parent = current - cols
      if (parent >= 0 && cells[parent] !== null) {
        cells[current] = cells[parent]
        cells[parent] = null
        if (parent in moved) {
          moved[current] = moved[parent]
          delete moved[parent]
        } else {
          moved[current] = parent
        }
        current = parent
      } else {
        cells[current] = null
        break
      }
    }
  }
  return moved
}

function fillEmptyIndices(cells) {
  const added = {}
  for (let i = 0; i < cells.length; i++) {
    if (cells[i] === null) {
      const tile = getRandomTile()
      cells[i] = tile
      added[i] = tile
    }
  }
  return added
}

function matchAndFillRecursively(cells) {
  let changes = []
  while (true) {
    const clusters = match3(cells)
    if (clusters.length === 0) {
      break
    }
    const moved = removeIndices(
      cells,
      clusters
        .flat()
        .filter((t, i, arr) => arr.indexOf(t) === i)
        .sort((a, b) => a - b)
    )
    const added = fillEmptyIndices(cells)
    changes.push({ removed: clusters, moved, added })
  }
  return changes
}

function swapIndices(cells, sourceIndex, targetIndex) {
  const sourceTile = cells[sourceIndex]
  cells[sourceIndex] = cells[targetIndex]
  cells[targetIndex] = sourceTile
  return cells
}

const swapAndMatch = (cells, sourceIndex, targetIndex) => {
  return matchAndFillRecursively(swapIndices(cells, sourceIndex, targetIndex))
}

function shuffle(sourceCells) {
  let moved, cells
  do {
    moved = {}
    cells = sourceCells.slice(0)
    const unswappedIndices = new Array(cells.length).fill(null).map((_, i) => i)
    while (unswappedIndices.length > 1) {
      const sourceIndex = unswappedIndices.splice(
        Math.floor(Math.random() * unswappedIndices.length),
        1
      )
      const targetIndex = unswappedIndices.splice(
        Math.floor(Math.random() * unswappedIndices.length),
        1
      )
      swapIndices(cells, sourceIndex, targetIndex)
      moved[sourceIndex] = targetIndex
      moved[targetIndex] = sourceIndex
    }
  } while (match3(cells).length !== 0 || !hasValidMoves(cells))
  return { moved, cells }
}

const getScoreForChange = (change) =>
  change.removed.reduce((sum, cluster) => sum + cluster.length ** 2, 0)

const getScoreForChanges = (changes) =>
  changes.map((change) => getScoreForChange(change)).reduce((a, b) => a + b, 0)

const getLowestScore = (players) =>
  Object.values(players).reduce(
    (acc, player) => Math.min(acc, player.score),
    Number.MAX_SAFE_INTEGER
  )

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: (playerIds) => {
    let cells
    do {
      // Generate cells randomly until we get a playable board
      cells = new Array(rows * cols).fill(null).map(() => getRandomTile())
    } while (match3(cells).length !== 0 || !hasValidMoves(cells))

    return {
      playerIds: playerIds
        .slice()
        .sort(() => (0.5 - Math.random() < 0 ? -1 : 1)),
      currentPlayerIndex: 0,
      movesPlayed: 0,
      movesPerRound: startingMovesPerRound,
      roundsPlayed: 0,
      startingScore: 0,
      cells,
      highlightedCells: {},
      players: Object.fromEntries(
        playerIds.map((id) => [
          id,
          {
            score: 0,
            shufflesRemaining: numberOfSpecialActions,
            extraMovesRemaining: numberOfSpecialActions,
          },
        ])
      ),
      changes: [],
    }
  },
  actions: {
    swap: ({ sourceIndex, targetIndex }, { game, playerId }) => {
      // Cannot play during someone else's turn
      if (playerId !== game.playerIds[game.currentPlayerIndex]) {
        throw Rune.invalidAction()
      }
      if (!isValidMove(game.cells, sourceIndex, targetIndex)) {
        throw Rune.invalidAction()
      }

      const { startingMovesPerRound, numberOfRounds } = getConfig()

      const changes = swapAndMatch(game.cells, sourceIndex, targetIndex)

      game.changes = changes
      game.movesPlayed++
      game.players[playerId].score += getScoreForChanges(changes)
      game.highlightedCells = {}

      if (!hasValidMoves(game.cells)) {
        const { moved, cells } = shuffle(game.cells)

        game.changes.push({
          removed: [],
          moved,
          added: {},
          message: "out-of-moves",
        })
        game.cells = cells
      }

      if (game.movesPlayed >= game.movesPerRound) {
        game.currentPlayerIndex =
          (game.currentPlayerIndex + 1) % game.playerIds.length
        game.movesPlayed = 0
        game.movesPerRound = startingMovesPerRound
        if (game.currentPlayerIndex === 0) {
          game.roundsPlayed++
          game.startingScore = getLowestScore(game.players)
        }
      }

      if (game.roundsPlayed >= numberOfRounds) {
        Rune.gameOver()
      }
    },
    // remove: ({ index }, { game, playerId }) => {
    //   if (playerId !== game.playerIds[game.currentPlayerIndex]) {
    //     throw Rune.invalidAction()
    //   }

    //   const removed = [index]
    //   const moved = removeIndices(game.cells, removed)
    //   const added = fillEmptyIndices(game.cells)
    //   const changes = matchAndFillRecursively(game.cells)
    //   changes.unshift({ removed: [removed], moved, added })
    //   game.changes = changes
    //   game.players[playerId].score += getScoreForChanges(changes)
    // },
    shuffle: (_, { game, playerId }) => {
      if (
        playerId !== game.playerIds[game.currentPlayerIndex] ||
        game.players[playerId].shufflesRemaining <= 0
      ) {
        throw Rune.invalidAction()
      }

      const { moved, cells } = shuffle(game.cells)

      game.changes = [{ removed: [], moved, added: {} }]
      game.cells = cells
      game.highlightedCells = {}
      game.players[playerId].shufflesRemaining--
    },
    extraMove: (_, { game, playerId }) => {
      if (
        playerId !== game.playerIds[game.currentPlayerIndex] ||
        game.players[playerId].extraMovesRemaining <= 0
      ) {
        throw Rune.invalidAction()
      }
      game.movesPerRound++
      game.players[playerId].extraMovesRemaining--
      game.changes = []
    },
    highlight: ({ index }, { game, playerId }) => {
      if (
        playerId === game.playerIds[game.currentPlayerIndex] ||
        index < 0 ||
        index >= game.cells.length
      ) {
        throw Rune.invalidAction()
      }
      if (game.highlightedCells[index] === playerId) {
        delete game.highlightedCells[index]
      } else {
        game.highlightedCells[index] = playerId
      }
      game.changes = []
    },
  },
  events: {
    playerJoined: (playerId, { game }) => {
      const { numberOfSpecialActions } = getConfig()
      game.playerIds.push(playerId)
      game.players[playerId] = {
        score: game.startingScore,
        shufflesRemaining: numberOfSpecialActions,
        extraMovesRemaining: numberOfSpecialActions,
      }
    },
    playerLeft: (playerId, { game }) => {
      const { numberOfRounds, startingMovesPerRound } = getConfig()
      const playerIndex = game.playerIds.indexOf(playerId)
      game.playerIds.splice(playerIndex, 1)
      delete game.players[playerId]
      if (game.currentPlayerIndex === playerIndex) {
        game.movesPlayed = 0
        game.movesPerRound = startingMovesPerRound
        if (playerIndex === game.playerIds.length) {
          game.currentPlayerIndex = 0
          game.roundsPlayed++
          game.startingScore = getLowestScore(game.players)

          if (game.roundsPlayed >= numberOfRounds) {
            Rune.gameOver()
          }
        }
      }
      if (game.currentPlayerIndex > playerIndex) {
        game.currentPlayerIndex--
      }
    },
  },
})
