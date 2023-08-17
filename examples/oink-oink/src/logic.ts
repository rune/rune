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
    guesses: [],
  }),
  actions: {
    setReadyToStart: (_, { game, playerId }) => {
      if (game.gameStarted) throw Rune.invalidAction()
      const player = game.players.find((player) => player.id === playerId)
      if (player) player.readyToStart = true
      startGameCheck(game)
    },
    makeGuess: ({ animal, emotion }, { game, playerId }) => {
      game.guesses.push({ playerId, animal, emotion })

      const currentTurn = game.turns.at(-1)
      if (!currentTurn) return

      if (currentTurn.animal === animal && currentTurn.emotion === emotion) {
        // TODO: award points. also maybe no need for turns to be an array?
        currentTurn.animal = getRandomItem(animals)
        currentTurn.emotion = getRandomItem(emotions)
      }
    },
    nextRound: (_, { game }) => {
      console.log("nextRound", game.round)
      if (game.round + 1 === numRounds) throw Rune.invalidAction()

      game.round += 1
      const actorIndex = game.players.findIndex((player) => player.actor)
      game.players[actorIndex].actor = false
      game.players[0].actor = true
      game.turns.push({
        animal: getRandomItem(animals),
        emotion: getRandomItem(emotions),
        stage: "countdown",
        countdownStartedAt: Rune.gameTimeInSeconds(),
      })
    },
  },
  events: {
    playerLeft: (playerId, { game }) => {
      game.players = game.players.filter((p) => p.id !== playerId)
      startGameCheck(game)

      // todo: switch to next actor
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
      const actorIndex = game.players.findIndex((player) => player.actor)

      if (actorIndex === game.players.length - 1) {
        currentTurn.stage = "result"
      } else {
        game.players[actorIndex].actor = false
        game.players[actorIndex + 1].actor = true
        game.turns.push({
          animal: getRandomItem(animals),
          emotion: getRandomItem(emotions),
          stage: "countdown",
          countdownStartedAt: Rune.gameTimeInSeconds(),
        })
      }
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
