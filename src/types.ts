// Global namespace properties needed for communicating with Rune
export interface InitInput {
  startGame: () => void
  resumeGame: () => void
  pauseGame: () => void
  getScore: () => number
}

export interface RuneExport {
  // External properties and functions
  version: string
  init: (input: InitInput) => void
  gameOver: () => void
  getChallengeNumber: () => number
  deterministicRandom: () => number

  // Internal properties and functions
  _doneInit: boolean
  _startGame: () => void
  _resumeGame: () => void
  _pauseGame: () => void
  _requestScore: () => void // Called by Rune
  _getScore: () => number // Provided by game
  _validateScore: (score: number) => void
  _randomNumberGenerator: (seed: number) => () => number
  _hashFromString: (str: string) => number
  _resetDeterministicRandom: () => void
  _runeChallengeNumber: number
}

declare global {
  var Rune: RuneExport | undefined

  // Available in case the game is running in native webview
  var ReactNativeWebView:
    | {
        postMessage: (data: string) => void
      }
    | undefined

  // used by legacy native clients
  var _runeChallengeNumber: number | undefined
  var runeWindowErrHandler: (event: ErrorEvent) => void | undefined
  var postRuneEvent: ((event: RuneGameEvent) => void) | undefined
}

// "Events" sent to Rune to e.g. communicate that the game is over
export type RuneGameEvent =
  | { type: "INIT"; version: string }
  | { type: "GAME_OVER"; score: number; challengeNumber: number }
  | { type: "ERR"; errMsg: string }
  | {
      type: "WINDOW_ERR"
      err: {
        msg: string
        filename: string
        lineno: number
        colno: number
      }
    }
  | { type: "SCORE"; score: number; challengeNumber: number }
  | { type: "BROWSER_INITIAL_OVERLAY_CLICKED" }
  | { type: "BROWSER_IFRAME_LOADED" }

// Commands sent to Game to e.g. start/stop the game
export type RuneGameCommand = {
  type: "_startGame" | "_resumeGame" | "_pauseGame" | "_requestScore"
}
