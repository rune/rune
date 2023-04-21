/* eslint no-undef: 0 */

import { pickRandom } from "./lib/pickRandom"
import { calculateDistanceKm } from "./lib/calculateDistanceKm"
import { calculateScore } from "./lib/calculateScore"
import { getPanoramas } from "./lib/data/getPanoramas"

const numRounds = 5

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: (playerIds) => {
    const rounds = []
    const remainingPanoramas = getPanoramas()

    for (let i = 0; i < numRounds; i++) {
      const randomPanorama = pickRandom(remainingPanoramas)
      remainingPanoramas.splice(remainingPanoramas.indexOf(randomPanorama), 1)
      rounds.push({ panorama: randomPanorama })
    }

    return {
      sessionId: Math.round(Math.random() * 1e9),
      playerIds,
      rounds,
      currentRound: 0,
      guesses: [],
    }
  },
  actions: {
    makeGuess: (location, { game, playerId }) => {
      const currentRound = game.currentRound
      const existingGuess = game.guesses.find(
        (guess) => guess.playerId === playerId && guess.round === currentRound
      )

      if (existingGuess) throw Rune.invalidAction()

      const distance =
        Math.round(
          calculateDistanceKm(location, [
            game.rounds[game.currentRound].panorama.longitude,
            game.rounds[game.currentRound].panorama.latitude,
          ]) * 1e4
        ) / 1e4

      game.guesses.push({
        playerId,
        round: game.currentRound,
        location,
        distance,
        score: calculateScore(distance),
      })

      if (game.guesses.length === game.playerIds.length * numRounds) {
        Rune.gameOver({
          players: game.guesses.reduce(
            (acc, guess) => ({
              ...acc,
              [guess.playerId]: (acc[guess.playerId] ?? 0) + guess.score,
            }),
            {} as {
              [playerId: string]: number
            }
          ),
          delayPopUp: true,
        })
      }
    },
    nextRound: (_, { game }) => {
      if (game.currentRound === numRounds - 1) throw Rune.invalidAction()

      const currentRound = game.currentRound
      const guesses = game.guesses.filter(
        (guess) => guess.round === currentRound
      )

      if (guesses.length !== game.playerIds.length) throw Rune.invalidAction()

      game.currentRound++
    },
  },
  events: {
    playerLeft: (playerId, { game }) => {
      game.playerIds = game.playerIds.filter((id) => id !== playerId)
      game.guesses = game.guesses.filter((guess) => guess.playerId !== playerId)
    },
  },
})
