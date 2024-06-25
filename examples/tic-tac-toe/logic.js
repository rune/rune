function setup() {
  const game = {
    cells: new Array(9).fill(null),
    lastMovePlayerId: null,
    winCombo: null,
    freeCells: true
  }
  return game
}

function claimCell(cellIndex, { game, playerId, allPlayerIds }) {
  // Do not allow to claim cell if it's already claimed or if it's not player's turn
  if (game.cells[cellIndex] !== null || playerId === game.lastMovePlayerId) {
    throw Dusk.invalidAction()
  }

  game.cells[cellIndex] = playerId
  game.lastMovePlayerId = playerId
  game.winCombo = findWinningCombo(game.cells)

  if (game.winCombo) {
    Dusk.gameOver({
      players: {
        [game.lastMovePlayerId]: "WON",
        [allPlayerIds.find((id) => id !== game.lastMovePlayerId)]: "LOST",
      },
    })
  }

  game.freeCells = game.cells.findIndex((cell) => cell === null) !== -1
  if (!game.freeCells) {
    Dusk.gameOver({
      everyone: "TIE"
    })
  }
}

function findWinningCombo (cells) {
  return [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
      .find(combo => combo.every(i => cells[i] && cells[i] === cells[combo[0]])) || null;
}

Dusk.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
  setup,
  actions: { claimCell }
})