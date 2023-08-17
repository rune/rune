import { GameState } from "./lib/types/GameState"

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 4,
  setup: (playerIds) => ({
    players: playerIds.map((id) => ({
      id,
      readyToStart: false,
    })),
    gameStarted: false,
  }),
  actions: {
    setReadyToStart: (_, { game, playerId }) => {
      if (game.gameStarted) throw Rune.invalidAction()
      const player = game.players.find((player) => player.id === playerId)
      if (player) player.readyToStart = true
      startGameCheck(game)
    },
  },
  events: {
    playerLeft: (playerId, { game }) => {
      game.players = game.players.filter((p) => p.id !== playerId)
      startGameCheck(game)
    },
  },
})

function startGameCheck(game: GameState) {
  if (game.gameStarted) return
  if (game.players.some((player) => !player.readyToStart)) return

  game.gameStarted = true
}
