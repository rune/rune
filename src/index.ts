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

export interface RuneExport extends InitInput {
  gameOver: (object: GameOverInput) => void
  init: (object: InitInput) => void
  version: string
}

const Rune: RuneExport = {
  // Make functions throw until init()
  startGame: () => {
    throw new Error("Rune.startGame() called before Rune.init()")
  },
  resumeGame: () => {
    throw new Error("Rune.resumeGame() called before Rune.init()")
  },
  pauseGame: () => {
    throw new Error("Rune.pauseGame() called before Rune.init()")
  },
  gameOver: () => {
    throw new Error("Rune.gameOver() called before Rune.init()")
  },
  init: ({ startGame, resumeGame, pauseGame }: InitInput) => {
    // Initialize the SDK with the game's functions
    Rune.startGame = startGame
    Rune.resumeGame = resumeGame
    Rune.pauseGame = pauseGame

    // If debugging locally, mimic events and e.g. start a new game after finishing.
    // When running inside Rune, the env RUNE_PLATFORM will always be provided.
    if (process.env.RUNE_PLATFORM === undefined) {
      Rune.gameOver = function ({ score }: GameOverInput) {
        console.log(`RUNE: Successfully communicated score of ${score}.`)
        console.log(`RUNE: Starting new game in 3 seconds.`)
        setTimeout(() => {
          Rune.startGame()
          console.log(`RUNE: Started new game.`)
        }, 3000)
      }
    }
  },
  // Allow Rune to see which SDK version the game is using
  version: "1.0.0",
}

export { Rune }
