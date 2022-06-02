// Global namespace properties needed for communicating with Rune
export interface InitInput {
  restartGame: () => void
  resumeGame: () => void
  pauseGame: () => void
  getScore: () => number
  // deprecated
  startGame?: () => void
}

export interface RuneExport {
  // External properties and functions
  version: string
  init: (input: InitInput) => void
  gameOver: () => void
  getChallengeNumber: () => number
  deterministicRandom: () => number
}

declare global {
  // Available in case the game is running in native webview
  var ReactNativeWebView:
    | {
        postMessage: (data: string) => void
      }
    | undefined
}

// "Events" sent to Rune to e.g. communicate that the game is over
export type RuneGameEvent =
  | { type: "INIT"; version: string }
  | { type: "GAME_OVER"; score: number; challengeNumber: number }
  | { type: "ERR"; errMsg: string }
  | { type: "WARNING"; msg: string }
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
export type LegacyRuneGameCommand = {
  type: "_startGame" | "_resumeGame" | "_pauseGame" | "_requestScore"
}

export type RuneAppCommand =
  | { type: "playGame" | "pauseGame" | "restartGame" | "requestScore" }
  | { type: "setForceMuteStatus"; muted: boolean }
