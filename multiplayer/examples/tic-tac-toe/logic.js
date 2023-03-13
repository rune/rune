const findWinningCombo = (cells) => {
  const WINNING_COMBOS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (const combo of WINNING_COMBOS) {
    const [i1, i2, i3] = combo
    if (
      cells[i1] !== null &&
      cells[i1] === cells[i2] &&
      cells[i1] === cells[i3]
    ) {
      return combo
    }
  }
  return null
}

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
  setup: (players) => ({
    players,
    lastPlayerId: null,
    cells: new Array(9).fill(null),
    winCombo: null,
    gameOver: false,
  }),
  actions: {
    claimCell: (cellIndex, { game, playerId }) => {
      // Cannot play during someone else's turn or claim existing cells
      if (game.cells[cellIndex] !== null || playerId === game.lastPlayerId) {
        throw Rune.invalidAction()
      }

      game.cells[cellIndex] = playerId
      game.winCombo = findWinningCombo(game.cells)

      // Game is over if someone won or if there are no available moves
      const gameOver =
        game.winCombo || game.cells.findIndex((cell) => cell === null) === -1
      game.lastPlayerId = playerId

      if (gameOver) {
        game.gameOver = true

        if (game.winCombo) {
          // Last person to make a move is the winner
          const winner = game.lastPlayerId
          // The other one must be the loser
          const loser = game.players.find((id) => id !== winner)

          Rune.gameOver({
            players: {
              [winner]: "WON",
              [loser]: "LOST",
            },
            delayPopUp: true,
          })
        } else {
          // Game is a draw
          Rune.gameOver({
            players: {
              [game.players[0]]: "LOST",
              [game.players[1]]: "LOST",
            },
            delayPopUp: true,
          })
        }
      }
    },
  },
})
