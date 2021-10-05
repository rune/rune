/*
The SDK interface for games to interact with Rune.
*/

interface GameOverInput {
  score: number
}

interface InitInput {
  startGame: () => void
  resumeGame: () => void
  pauseGame: () => void
}

export interface RuneExport {
  version: string
  // External functions
  gameOver: (input: GameOverInput) => void
  init: (input: InitInput) => void
  // Internal functions
  _startGame: () => void
  _resumeGame: () => void
  _pauseGame: () => void
}

export const Rune: RuneExport = {
  init: (input: InitInput) => {
    // Check that game provided correct input to SDK
    const { startGame, resumeGame, pauseGame } = input || {}
    if (typeof startGame !== "function") {
      throw new Error("Invalid startGame function provided to Rune.init()")
    }
    if (typeof resumeGame !== "function") {
      throw new Error("Invalid resumeGame function provided to Rune.init()")
    }
    if (typeof pauseGame !== "function") {
      throw new Error("Invalid pauseGame function provided to Rune.init()")
    }

    // Initialize the SDK with the game's functions
    Rune._startGame = startGame
    Rune._resumeGame = resumeGame
    Rune._pauseGame = pauseGame

    // When running inside Rune, the env RUNE_PLATFORM will always be provided.
    // The gameOver function will be provided by the Rune.
    if (process.env.RUNE_PLATFORM === undefined) {
      // If debugging locally, mimic events and e.g. start a new game after finishing
      Rune.gameOver = function ({ score }: GameOverInput) {
        console.log(`RUNE: Successfully communicated score of ${score}.`)
        console.log(`RUNE: Starting new game in 3 seconds.`)
        setTimeout(() => {
          Rune._startGame()
          console.log(`RUNE: Started new game.`)
        }, 3000)
      }

      // Mimic the user starting the game by tapping into it
      console.log(`RUNE: Successfully initialized.`)
      console.log(`RUNE: Starting new game in 3 seconds.`)
      setTimeout(() => {
        Rune._startGame()
        console.log(`RUNE: Started new game.`)
      }, 3000)
    }
  },
  // Allow Rune to see which SDK version the game is using
  version: "1.0.0",
  // Make functions throw until init()
  _startGame: () => {
    throw new Error("Rune._startGame() called before Rune.init()")
  },
  _resumeGame: () => {
    throw new Error("Rune._resumeGame() called before Rune.init()")
  },
  _pauseGame: () => {
    throw new Error("Rune._pauseGame() called before Rune.init()")
  },
  gameOver: () => {
    throw new Error("Rune.gameOver() called before Rune.init()")
  },
}
