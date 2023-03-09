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
  const { cols, numberOfTiles } = getConfig()
  let current = originIndex
  const tile = cells[originIndex] % numberOfTiles
  while (true) {
    const next = current + step
    if (
      (shouldSeekHorizontally
        ? Math.floor(next / cols) === Math.floor(originIndex / cols)
        : next % cols === originIndex % cols) &&
      next in cells &&
      cells[next] % numberOfTiles === tile
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
      if (
        cluster.length !== 0 &&
        cells[cluster[0]] % numberOfTiles !== cells[index] % numberOfTiles
      ) {
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
      if (
        cluster.length !== 0 &&
        cells[cluster[0]] % numberOfTiles !== cells[index] % numberOfTiles
      ) {
        cluster = []
      }
      cluster.push(index)
      if (cluster.length === 3) {
        clusters.push(cluster)
      }
    }
  }

  return clusters.reduce((acc, current) => {
    for (const item of acc) {
      for (const index of current) {
        if (item.includes(index)) {
          item.push(...current.filter((i) => i !== index))
          item.sort((a, b) => a - b)
          return acc
        }
      }
    }
    acc.push(current)
    return acc
  }, [])
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

function swapIndices(cells, sourceIndex, targetIndex) {
  const sourceTile = cells[sourceIndex]
  cells[sourceIndex] = cells[targetIndex]
  cells[targetIndex] = sourceTile
  return cells
}

const swapAndMatch = (cells, sourceIndex, targetIndex) => {
  swapIndices(cells, sourceIndex, targetIndex)
  let changes = []
  let firstPass = true
  while (true) {
    const clusters = match3(cells)
    if (clusters.length === 0) {
      break
    }
    const removed = clusters.filter((arr) => arr.length <= 3)
    const indicesToRemove = removed
      .flat()
      .filter((t, i, arr) => arr.indexOf(t) === i)
    const cleared = []
    for (const index of clusters.flat()) {
      const tile = cells[index]
      let indices
      switch (Math.floor((tile - 1) / numberOfTiles)) {
        // Horizontal arrow
        case 1: {
          indices = new Array(cols)
            .fill(Math.floor(index / cols) * cols)
            .map((start, i) => start + i)
          break
        }
        // Vertical arrow
        case 2: {
          indices = new Array(cols)
            .fill(index % cols)
            .map((start, i) => start + cols * i)
          break
        }
        // Bomb
        case 3: {
          indices = [
            index,
            index - 1, // left
            index + 1, // right
            index - cols, // top
            index + cols, // bottom
            index - cols - 1, // top left
            index - cols + 1, // top right
            index + cols - 1, // bottom left
            index + cols + 1, // bottom right
          ].filter((value, i, arr) => {
            const c1 = getCoordinatesForIndex(value)
            const c2 = getCoordinatesForIndex(arr[0])
            return (
              value >= 0 &&
              value < cols * rows &&
              Math.abs(c1.row - c2.row) <= 1 &&
              Math.abs(c1.col - c2.col) <= 1
            )
          })
          break
        }
        default: {
          continue
        }
      }
      cleared.push({ tile, index, indices })
      indicesToRemove.push(...indices)
    }
    // These are special tiles that either become line clearers or bombs
    const merged = clusters.filter((arr) => arr.length > 3)
    for (const i in merged) {
      const arr = merged[i]
      const isVertical =
        arr.findIndex(
          (index, i, arr) => i !== 0 && index - arr[i - 1] !== cols
        ) === -1
      const mergedIndex = isVertical
        ? arr[arr.length - 1]
        : firstPass && arr.includes(sourceIndex)
        ? sourceIndex
        : firstPass && arr.includes(targetIndex)
        ? targetIndex
        : arr[Math.floor(arr.length / 2)]
      cells[mergedIndex] =
        ((cells[mergedIndex] - 1) % numberOfTiles) +
        1 +
        (arr.length === 4 ? (isVertical ? 2 : 1) : 3) * numberOfTiles
      if (indicesToRemove.includes(mergedIndex)) {
        indicesToRemove.splice(indicesToRemove.indexOf(mergedIndex), 1)
      }

      arr.splice(arr.indexOf(mergedIndex), 1)
      merged[i] = {
        index: mergedIndex,
        tile: cells[mergedIndex],
        vertical: isVertical,
        indices: arr,
      }
      indicesToRemove.push(...arr)
    }

    const moved = removeIndices(
      cells,
      indicesToRemove
        .filter((t, i, arr) => arr.indexOf(t) === i)
        .sort((a, b) => a - b)
    )
    const added = fillEmptyIndices(cells)
    changes.push({ removed, merged, cleared, moved, added })
    firstPass = false
  }
  return changes
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

function getScoreForChange({ removed, merged, cleared }) {
  const clusters = removed.concat(
    merged.map(({ index, indices }) => [index].concat(indices))
  )
  const matched = clusters.flat()
  let sum = clusters.reduce((sum, cluster) => sum + cluster.length ** 2, 0)
  for (const index of cleared
    .map(({ indices }) => indices)
    .flat()
    .filter((t, i, arr) => arr.indexOf(t) === i)) {
    if (!matched.includes(index)) {
      sum += 3
    }
  }
  return sum
}

const getScoreForChanges = (changes) =>
  changes.map((change) => getScoreForChange(change)).reduce((a, b) => a + b, 0)

const getLowestScore = (players) =>
  Object.values(players).reduce(
    (acc, player) => Math.min(acc, player.score),
    Number.MAX_SAFE_INTEGER
  )

const getScores = (players) =>
  Object.entries(players).reduce((acc, [id, player]) => {
    acc[id] = player.score
    return acc
  }, {})

const isGameOver = (game) => game.roundsPlayed >= numberOfRounds

const advanceToNextPlayer = (game) => {
  const { startingMovesPerRound, numberOfRounds } = getConfig()
  if (game.currentPlayerIndex === game.playerIds.length - 1) {
    game.roundsPlayed++
    if (isGameOver(game)) {
      return Rune.gameOver({
        players: getScores(game.players),
        delayPopUp: true,
      })
    }
    game.currentPlayerIndex = 0
    game.startingScore = getLowestScore(game.players)
  } else {
    game.currentPlayerIndex++
  }

  game.movesPlayed = 0
  game.movesPerRound = startingMovesPerRound
  if (game.roundsPlayed === numberOfRounds - 1) {
    const playerId = game.playerIds[game.currentPlayerIndex]
    game.movesPerRound += game.players[playerId].extraMovesRemaining
    game.players[playerId].extraMovesRemaining = 0
  }
  return game
}

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

      const changes = swapAndMatch(game.cells, sourceIndex, targetIndex)

      game.changes = changes
      game.movesPlayed++
      game.players[playerId].score += getScoreForChanges(changes)
      game.highlightedCells = {}

      if (!hasValidMoves(game.cells)) {
        const { moved, cells } = shuffle(game.cells)

        game.changes.push({
          removed: [],
          merged: [],
          cleared: [],
          moved,
          added: {},
          message: "out-of-moves",
        })
        game.cells = cells
      }

      if (game.movesPlayed >= game.movesPerRound) {
        advanceToNextPlayer(game)
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

      game.changes = [
        { removed: [], moved, added: {}, merged: [], cleared: [] },
      ]
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
      const playerIndex = game.playerIds.indexOf(playerId)
      game.playerIds.splice(playerIndex, 1)
      delete game.players[playerId]
      if (game.currentPlayerIndex === playerIndex) {
        game.currentPlayerIndex--
        advanceToNextPlayer(game)
      } else if (game.currentPlayerIndex > playerIndex) {
        game.currentPlayerIndex--
      }
    },
  },
})
