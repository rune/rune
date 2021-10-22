/*
The SDK interface for games to interact with Rune.
*/

declare global {
  var postRuneEvent: ((event: RuneGameEvent) => void) | undefined
}

interface GameOverInput {
  score: number
}

interface InitInput {
  startGame: () => void
  resumeGame: () => void
  pauseGame: () => void
}

export type RuneGameEvent =
  | { type: "INIT"; version: string }
  | { type: "GAME_OVER"; score: number }
  | { type: "ERR"; errMsg: string }

export interface RuneExport {
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

    // When running inside Rune, runePostMessage will always be defined.
    if (globalThis.postRuneEvent) {
      globalThis.postRuneEvent({ type: "INIT", version: "1.1.1" })
    } else {
      mockEvents()
    }
  },
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
  gameOver: ({ score }) => {
    globalThis.postRuneEvent?.({ type: "GAME_OVER", score })
  },
}

// Create mock events to support development
const mockEvents = () => {
  // Log posted events to the console (in production, these are processed by Rune)
  globalThis.postRuneEvent = (event: RuneGameEvent) =>
    console.log(`RUNE: Posted ${JSON.stringify(event)}`)

  // Mimic the user tapping Play after 3 seconds
  console.log(`RUNE: Starting new game in 3 seconds.`)
  setTimeout(() => {
    Rune._startGame()
    console.log(`RUNE: Started new game.`)
  }, 3000)

  // Automatically restart game 3 seconds after Game Over
  Rune.gameOver = function ({ score }) {
    globalThis.postRuneEvent?.({ type: "GAME_OVER", score })
    console.log(`RUNE: Starting new game in 3 seconds.`)
    setTimeout(() => {
      Rune._startGame()
      console.log(`RUNE: Started new game.`)
    }, 3000)
  }
}
