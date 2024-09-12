// This file serves as a negative test case for an allowed logic.js file.

const isVictoryOrDraw = (game) => {
  for (let playerId in game.scores) {
    if (game.scores[playerId] >= 10) {
      return playerId
    }
  }
}

Rune.initLogic({
  minPlayers: 4,
  maxPlayers: 4,
  setup: (players) => {
    const scores = {}
    for (let playerId in players) {
      scores[playerId] = 0
    }
    return { scores }
  },
  actions: {
    score: (game, { playerId, amount }) => {
      if (amount <= 0) {
        Rune.invalidAction()
      }

      game[playerId] += amount

      // Determine if game has ended
      const winner = isVictoryOrDraw(game)
      if (winner !== undefined) {
        Rune.endGame({ winner })
      }
    },
  },
  events: {
    playerJoined: (game, players, playerId) => {
      game.scores[playerId] = 0
    },
  },
})
