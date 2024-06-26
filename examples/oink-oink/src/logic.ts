import { animals, emotions } from "./lib/types/GameState"
import { getRandomItem } from "./lib/getRandomItem"
import { setActor } from "./lib/setActor"
import { isLastActor } from "./lib/isLastActor"
import { newTurn } from "./lib/newTurn"
import { startGameCheck } from "./lib/startGameCheck"

export const numRounds = 3
export const turnCountdown = 3
export const turnDuration = 30
export const turnAlmostOverAt = 5
export const endOfTurnDuration = 3
export const displayCorrectGuessFor = 3
export const hideGuessTurnButtonDuration = 10

Dusk.initLogic({
  minPlayers: 2,
  maxPlayers: 6,
  setup: (playerIds) => ({
    players: playerIds.map((id) => ({
      id,
      readyToStart: false,
      actor: false,
      score: {
        acting: 0,
        guessing: 0,
      },
      latestTurnScore: {
        acting: 0,
        guessing: 0,
      },
      latestRoundScore: {
        acting: 0,
        guessing: 0,
      },
    })),
    gameStarted: false,
    round: 0,
    animals: animals.slice(0, 8), // First 8 animals
    emotions: emotions.slice(0), // All emotions
    currentTurn: null,
    guesses: [],
    gameOver: false,
  }),
  actions: {
    setReadyToStart: (_, { game, playerId }) => {
      if (game.gameStarted) throw Dusk.invalidAction()

      const player = game.players.find((player) => player.id === playerId)

      if (!player) throw Dusk.invalidAction()
      player.readyToStart = true

      startGameCheck(game)
    },
    makeGuess: ({ animal, emotion, round }, { game, playerId }) => {
      if (!game.currentTurn) throw Dusk.invalidAction()
      if (game.round !== round) throw Dusk.invalidAction()

      const guess = {
        playerId,
        animal,
        emotion,
        correct:
          game.currentTurn.animal === animal &&
          game.currentTurn.emotion === emotion,
      }

      game.guesses.push(guess)

      if (guess.correct) {
        const player = game.players.find((player) => player.id === playerId)
        const actor = game.players.find((player) => player.actor)

        if (!player || !actor) throw Dusk.invalidAction()

        player.score.guessing += 1
        player.latestTurnScore.guessing += 1
        player.latestRoundScore.guessing += 1

        actor.score.acting += 1
        actor.latestTurnScore.acting += 1
        actor.latestRoundScore.acting += 1

        game.currentTurn.animal = getRandomItem(game.animals)
        game.currentTurn.emotion = getRandomItem(game.emotions)

        game.currentTurn.timerStartedAt += displayCorrectGuessFor
        game.currentTurn.latestActingStartedAt =
          Dusk.gameTimeInSeconds() + displayCorrectGuessFor
        game.currentTurn.showSkipGuessButton = false
      }
    },
    skipGuess: (_, { game }) => {
      if (!game.currentTurn) throw Dusk.invalidAction()

      game.currentTurn.animal = getRandomItem(game.animals)
      game.currentTurn.emotion = getRandomItem(game.emotions)
      game.currentTurn.latestActingStartedAt = Dusk.gameTimeInSeconds()
      game.currentTurn.showSkipGuessButton = false
    },
    nextRound: (_, { game }) => {
      if (game.round + 1 === numRounds) throw Dusk.invalidAction()
      if (game.currentTurn?.stage !== "result") throw Dusk.invalidAction()

      for (const player of game.players) {
        player.latestRoundScore.guessing = 0
        player.latestRoundScore.acting = 0
      }

      // Get random 8 animals (keep emotions the same)
      game.animals = [...animals].sort(() => Math.random() - 0.5).slice(0, 8)

      game.round += 1
      setActor(game, "first")
      newTurn(game)
    },
  },
  events: {
    playerLeft: (playerId, { game }) => {
      game.players = game.players.filter((player) => player.id !== playerId)

      startGameCheck(game)

      if (
        game.currentTurn &&
        (game.currentTurn.stage === "acting" ||
          game.currentTurn.stage === "countdown")
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

    switch (game.currentTurn.stage) {
      case "countdown":
        if (
          Dusk.gameTimeInSeconds() >=
          game.currentTurn.timerStartedAt + turnCountdown
        ) {
          game.currentTurn.stage = "acting"
          game.currentTurn.timerStartedAt = Dusk.gameTimeInSeconds()
          game.currentTurn.latestActingStartedAt = Dusk.gameTimeInSeconds()
          game.currentTurn.showSkipGuessButton = false
        }
        break
      case "acting":
        if (
          Dusk.gameTimeInSeconds() >=
          game.currentTurn.timerStartedAt + turnDuration
        ) {
          game.currentTurn.stage = "endOfTurn"
          game.currentTurn.timerStartedAt = Dusk.gameTimeInSeconds()
          game.currentTurn.latestActingStartedAt = Dusk.gameTimeInSeconds()
          game.currentTurn.showSkipGuessButton = false
        }

        if (
          Dusk.gameTimeInSeconds() >=
          game.currentTurn.latestActingStartedAt + hideGuessTurnButtonDuration
        ) {
          game.currentTurn.showSkipGuessButton = true
        }
        break
      case "endOfTurn":
        if (
          Dusk.gameTimeInSeconds() >=
          game.currentTurn.timerStartedAt + endOfTurnDuration
        ) {
          for (const player of game.players) {
            player.latestTurnScore.guessing = 0
            player.latestTurnScore.acting = 0
          }

          if (isLastActor(game)) {
            game.currentTurn.stage = "result"

            if (game.round + 1 === numRounds) {
              game.gameOver = true
              Dusk.gameOver({
                players: game.players.reduce(
                  (acc, player) => ({
                    ...acc,
                    [player.id]: player.score.acting + player.score.guessing,
                  }),
                  {}
                ),
                delayPopUp: true,
                minimizePopUp: true,
              })
            }
          } else {
            setActor(game, "next")
            newTurn(game)
          }
        }
        break
    }
  },
})
