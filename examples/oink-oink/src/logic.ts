import { GameState, animals, emotions } from "./lib/types/GameState"

export const numRounds = 3
export const turnCountdown = 3

export const turnDuration = 10

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 4,
  setup: (playerIds) => ({
    players: playerIds.map((id) => ({
      id,
      readyToStart: false,
      actor: false,
      score: 0,
      latestScore: 0,
    })),
    gameStarted: false,
    round: 0,
    currentTurn: null,
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

      if (!game.currentTurn) return

      if (
        game.currentTurn.animal === animal &&
        game.currentTurn.emotion === emotion
      ) {
        const player = game.players.find((player) => player.id === playerId)
        const actor = game.players.find((player) => player.actor)

        if (!player || !actor) return

        player.score += 1
        player.latestScore += 1
        actor.score += 1
        actor.latestScore += 1

        game.currentTurn.animal = getRandomItem(animals)
        game.currentTurn.emotion = getRandomItem(emotions)
      }
    },
    nextRound: (_, { game }) => {
      if (game.round + 1 === numRounds) throw Rune.invalidAction()

      game.round += 1
      setActor(game, "first")
      newTurn(game)

      for (const player of game.players) {
        player.latestScore = 0
      }
    },
  },
  events: {
    playerLeft: (playerId, { game }) => {
      game.players = game.players.filter((p) => p.id !== playerId)
      startGameCheck(game)

      if (!game.currentTurn) return

      if (
        game.currentTurn.stage === "acting" ||
        game.currentTurn.stage === "countdown"
      ) {
        if (isLastActor(game)) {
          game.currentTurn.stage = "result"
        } else {
          setActor(game, "next")
          newTurn(game)
        }
      }
    },
  },
  update: ({ game }) => {
    if (!game.currentTurn) return

    if (
      game.currentTurn.stage === "countdown" &&
      game.currentTurn.timerStartedAt &&
      Rune.gameTimeInSeconds() >=
        game.currentTurn.timerStartedAt + turnCountdown
    ) {
      game.currentTurn.stage = "acting"
      game.currentTurn.timerStartedAt = Rune.gameTimeInSeconds()
    }

    if (
      game.currentTurn.stage === "acting" &&
      game.currentTurn.timerStartedAt &&
      Rune.gameTimeInSeconds() >= game.currentTurn.timerStartedAt + turnDuration
    ) {
      if (isLastActor(game)) {
        game.currentTurn.stage = "result"
      } else {
        setActor(game, "next")
        newTurn(game)
      }
    }

    // TODO: figure out how to do:
    //  "The timer is paused during the screens/animations where a correct
    //  guess is being shown in the interest of fairness."
  },
})

function getRandomItem<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

function startGameCheck(game: GameState) {
  if (game.gameStarted) return
  if (game.players.some((player) => !player.readyToStart)) return

  game.gameStarted = true

  setActor(game, "first")
  newTurn(game)
}

function isLastActor(game: GameState) {
  const actorIndex = game.players.findIndex((player) => player.actor)
  return actorIndex + 1 === game.players.length
}

function setActor(game: GameState, which: "first" | "next") {
  const actorIndex = game.players.findIndex((player) => player.actor)
  const nextActorIndex = which === "first" ? 0 : actorIndex + 1

  if (~actorIndex) game.players[actorIndex].actor = false
  game.players[nextActorIndex].actor = true
}

function newTurn(game: GameState) {
  game.currentTurn = {
    animal: getRandomItem(animals),
    emotion: getRandomItem(emotions),
    stage: "countdown",
    timerStartedAt: Rune.gameTimeInSeconds(),
  }
}
