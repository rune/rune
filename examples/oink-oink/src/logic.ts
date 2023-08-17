import { GameState, animals, emotions } from "./lib/types/GameState"

export const numRounds = 3
export const turnCountdown = 3

export const turnDuration = 30

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 4,
  setup: (playerIds) => ({
    players: playerIds.map((id) => ({
      id,
      readyToStart: false,
      actor: false,
    })),
    gameStarted: false,
    round: 0,
    turns: [],
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
  update: ({ game }) => {
    const currentTurn = game.turns.at(-1)

    if (!currentTurn) return

    if (
      currentTurn.stage === "countdown" &&
      currentTurn.countdownStartedAt &&
      Rune.gameTimeInSeconds() >= currentTurn.countdownStartedAt + turnCountdown
    ) {
      currentTurn.stage = "acting"
      currentTurn.timerStartedAt = Rune.gameTimeInSeconds()
    }

    if (
      currentTurn.stage === "acting" &&
      currentTurn.timerStartedAt &&
      Rune.gameTimeInSeconds() >= currentTurn.timerStartedAt + turnDuration
    ) {
      currentTurn.stage = "result"
    }
  },
})

function getRandomItem<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

function startGameCheck(game: GameState) {
  if (game.gameStarted) return
  if (game.players.some((player) => !player.readyToStart)) return

  game.gameStarted = true
  game.players[0].actor = true
  game.turns.push({
    animal: getRandomItem(animals),
    emotion: getRandomItem(emotions),
    stage: "countdown",
    countdownStartedAt: Rune.gameTimeInSeconds(),
  })
}
