/*
The SDK interface for games to interact with Rune.
*/
import { RuneExport, InitInput, RuneGameCommand, RuneGameEvent } from "./types"
import { getRuneGameEvent, stringifyRuneGameCommand } from "./api"
import { postRuneEvent } from "./internal/messageBridge"

function getRuneSdk() {
  let doneFirstPlay = false

  const Rune: RuneExport = {
    // External properties and functions
    version: "1.5.3",
    init: (input: InitInput) => {
      // Check that this function has not already been called
      if (Rune._doneInit) {
        throw new Error("Rune.init() should only be called once")
      }
      Rune._doneInit = true

      // Check that game provided correct input to SDK
      const { startGame, resumeGame, pauseGame, getScore } = input || {}
      if (typeof startGame !== "function") {
        throw new Error("Invalid startGame function provided to Rune.init()")
      }
      if (typeof resumeGame !== "function") {
        throw new Error("Invalid resumeGame function provided to Rune.init()")
      }
      if (typeof pauseGame !== "function") {
        throw new Error("Invalid pauseGame function provided to Rune.init()")
      }
      if (typeof getScore !== "function") {
        throw new Error("Invalid getScore function provided to Rune.init()")
      }
      Rune._validateScore(getScore())

      // Initialize the SDK with the game's functions
      Rune._startGame = () => {
        //Restart the random function starting from the 2nd time the game is started (due to restart/game over)
        if (doneFirstPlay) {
          Rune._resetDeterministicRandom()
        }

        doneFirstPlay = true

        return startGame()
      }
      Rune._resumeGame = resumeGame
      Rune._pauseGame = pauseGame
      Rune._getScore = getScore

      // When running inside Rune, runePostMessage will always be defined.
      postRuneEvent({ type: "INIT", version: Rune.version })
    },
    gameOver: () => {
      if (!Rune._doneInit) {
        throw new Error("Rune.gameOver() called before Rune.init()")
      }
      const score = Rune._getScore()
      Rune._validateScore(score)
      postRuneEvent({
        type: "GAME_OVER",
        score,
        challengeNumber: Rune.getChallengeNumber(),
      })
    },
    getChallengeNumber: () => {
      // TODO remove _runeChallengeNumber usage when native app is migrated
      if (globalThis._runeChallengeNumber) {
        return globalThis._runeChallengeNumber
      }

      return Rune._runeChallengeNumber ?? 1
    },
    deterministicRandom: () => {
      // The first time that this method is called, replace it with our
      // deterministic random number generator and return the first number.
      Rune._resetDeterministicRandom()
      return Rune.deterministicRandom()
    },

    // Internal properties and functions used by the Rune app
    _doneInit: false,
    _requestScore: () => {
      const score = Rune._getScore()
      Rune._validateScore(score)
      postRuneEvent({
        type: "SCORE",
        score,
        challengeNumber: Rune.getChallengeNumber(),
      })
    },
    _startGame: () => {
      throw new Error("Rune._startGame() called before Rune.init()")
    },
    _resumeGame: () => {
      throw new Error("Rune._resumeGame() called before Rune.init()")
    },
    _pauseGame: () => {
      throw new Error("Rune._pauseGame() called before Rune.init()")
    },
    _getScore: () => {
      throw new Error("Rune._getScore() called before Rune.init()")
    },
    _validateScore: (score: number) => {
      if (typeof score !== "number") {
        throw new Error(`Score is not a number. Received: ${typeof score}`)
      }
      if (score < 0 || score > Math.pow(10, 9)) {
        throw new Error(`Score is not between 0 and 1000000000. Received: ${score}`)
      }
      if (!Number.isInteger(score)) {
        throw new Error(`Score is not an integer. Received: ${score}`)
      }
    },
    // A pseudorandom number generator (PRNG) for determinism.
    // Based on the efficient mulberry32 with 32-bit state.
    // From https://github.com/bryc/code/blob/master/jshash/PRNGs.md.
    _randomNumberGenerator: (seed) => {
      // Initialize using hash function to avoid seed quality issues.
      // E.g. to avoid correlations between using 1 and 2 as seed.
      let hash = Rune._hashFromString(seed.toString())

      return function () {
        let t = (hash += 0x6d2b79f5)
        t = Math.imul(t ^ (t >>> 15), t | 1)
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
      }
    },
    // xmur3 from https://github.com/bryc/code/blob/master/jshash/PRNGs.md.
    // Returns a number as opposed to seed() function for ease of use.
    _hashFromString: (str) => {
      for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
        h = (h << 13) | (h >>> 19)
      }
      const seed = () => {
        h = Math.imul(h ^ (h >>> 16), 2246822507)
        h = Math.imul(h ^ (h >>> 13), 3266489909)
        return (h ^= h >>> 16) >>> 0
      }
      return seed()
    },
    _resetDeterministicRandom: () => {
      // Reset randomness to be deterministic across plays
      Rune.deterministicRandom = Rune._randomNumberGenerator(Rune.getChallengeNumber())
    },
    _runeChallengeNumber: 1,
  }

  return Rune
}

export type { RuneExport, InitInput, RuneGameEvent, RuneGameCommand }
export { getRuneSdk, getRuneGameEvent, stringifyRuneGameCommand }
