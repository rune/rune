const getConfig = () => ({
  rows: 7,
  cols: 7,
  numberOfTiles: 6,
  turnsPerRound: 2,
  numberOfRounds: 5,
})
const { rows, cols, numberOfTiles, turnsPerRound, numberOfRounds } = getConfig()

const getRandomTile = () => Math.ceil(Math.random() * numberOfTiles)

const getCoordinatesForIndex = (index) => {
  const row = Math.floor(index / cols)
  const col = index % cols
  return { row, col }
}

const areCoordinatesValid = (row, col) =>
  row >= 0 && row < rows && col >= 0 && col < cols

const getIndexForCoordinates = (row, col) => {
  if (!areCoordinatesValid(row, col)) {
    throw new Error("Out of bounds")
  }
  return row * cols + col
}

const areCellsNeighbors = (index1, index2) => {
  const coords1 = getCoordinatesForIndex(index1)
  const coords2 = getCoordinatesForIndex(index2)
  return (
    Math.abs(coords1.row - coords2.row) <= 1 &&
    Math.abs(coords1.col - coords2.col) <= 1 &&
    index1 !== index2
  )
}

const match3 = (cells) => {
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

const removeIndices = (cells, indices) => {
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

const fillEmptyIndices = (cells) => {
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

const matchAndFillRecursively = (cells) => {
  let changes = []
  while (true) {
    const clusters = match3(cells)
    if (clusters.length === 0) {
      break
    }
    const moved = removeIndices(
      cells,
      clusters.flat().sort((a, b) => a - b)
    )
    const added = fillEmptyIndices(cells)
    changes.push({ removed: clusters, moved, added })
  }
  return changes
}

const swapIndices = (cells, sourceIndex, targetIndex) => {
  const sourceTile = cells[sourceIndex]
  cells[sourceIndex] = cells[targetIndex]
  cells[targetIndex] = sourceTile
  return cells
}

const swapAndMatch = (cells, sourceIndex, targetIndex) => {
  return matchAndFillRecursively(swapIndices(cells, sourceIndex, targetIndex))
}

const getScoreForChange = (change) =>
  change.removed.reduce((sum, cluster) => sum + cluster.length ** 2, 0)

const getScoreForChanges = (changes) =>
  changes.map((change) => getScoreForChange(change)).reduce((a, b) => a + b, 0)

const getLowestScore = (scores) =>
  Object.values(scores).reduce(
    (a, b) => Math.min(a, b),
    Number.MAX_SAFE_INTEGER
  )

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: (playerIds) => {
    const cells = new Array(rows * cols).fill(null).map(() => getRandomTile())
    matchAndFillRecursively(cells)
    const currentPlayerIndex = Math.floor(Math.random() * playerIds.length)
    return {
      playerIds,
      currentPlayerIndex,
      turnsPlayed: 0,
      roundsPlayed: 0,
      startingScore: 0,
      cells,
      scores: Object.fromEntries(playerIds.map((id) => [id, 0])),
      changes: [],
    }
  },
  actions: {
    swap: ({ sourceIndex, targetIndex }, { game, playerId }) => {
      // Cannot play during someone else's turn
      if (playerId !== game.playerIds[game.currentPlayerIndex]) {
        throw Rune.invalidAction()
      }
      if (!areCellsNeighbors(sourceIndex, targetIndex)) {
        throw Rune.invalidAction()
      }

      const { turnsPerRound, numberOfRounds } = getConfig()

      const changes = swapAndMatch(game.cells, sourceIndex, targetIndex)
      if (changes.length === 0) {
        throw Rune.invalidAction()
      }
      game.changes = changes
      game.turnsPlayed++
      game.scores[playerId] += getScoreForChanges(changes)

      if (game.turnsPlayed >= turnsPerRound) {
        game.currentPlayerIndex =
          (game.currentPlayerIndex + 1) % game.playerIds.length
        game.turnsPlayed = 0
        if (game.currentPlayerIndex === 0) {
          game.roundsPlayed++
          game.startingScore = getLowestScore(game.scores)
        }
      }

      if (game.roundsPlayed >= numberOfRounds) {
        Rune.gameOver()
      }
    },
    remove: ({ index }, { game, playerId }) => {
      if (playerId !== game.playerIds[game.currentPlayerIndex]) {
        throw Rune.invalidAction()
      }

      const removed = [index]
      const moved = removeIndices(game.cells, removed)
      const added = fillEmptyIndices(game.cells)
      const changes = matchAndFillRecursively(game.cells)
      changes.unshift({ removed: [removed], moved, added })
      game.changes = changes
      game.scores[playerId] += getScoreForChanges(changes)
    },
    shuffle: (_, { game, playerId }) => {
      if (playerId !== game.playerIds[game.currentPlayerIndex]) {
        throw Rune.invalidAction()
      }
      while (true) {
        const moved = {}
        const cells = game.cells.slice(0)
        const unswappedIndices = new Array(cells.length)
          .fill(null)
          .map((_, i) => i)
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
        if (match3(cells).length === 0) {
          game.changes = [{ removed: [], moved, added: {} }]
          game.cells = cells
          break
        }
      }
    },
  },
  events: {
    playerJoined: (playerId, { game }) => {
      game.playerIds.push(playerId)
      game.scores[playerId] = game.startingScore
    },
    playerLeft: (playerId, { game }) => {
      const { numberOfRounds } = getConfig()
      const playerIndex = game.playerIds.indexOf(playerId)
      game.playerIds.splice(playerIndex, 1)
      delete game.scores[playerId]
      if (game.currentPlayerIndex === playerIndex) {
        game.turnsPlayed = 0
        if (playerIndex === game.playerIds.length) {
          game.currentPlayerIndex = 0
          game.roundsPlayed++
          game.startingScore = getLowestScore(game.scores)

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
