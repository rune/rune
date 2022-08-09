// Global namespace properties needed for communicating with Rune
export interface InitInput {
  restartGame: () => void
  resumeGame: () => void
  pauseGame: () => void
  getScore:
    | {
        (): number
        callbackReturnValueNotSupported?: false
      }
    | {
        (): void
        callbackReturnValueNotSupported: true
        score: number
      }
  // deprecated
  startGame?: () => void
}

export type NormalizedInitInput = Omit<InitInput, "getScore"> & {
  getScore: () => number
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
  | {
      type: "GAME_OVER"
      gamePlayUuid: string
      score: number
      challengeNumber: number
    }
  | {
      type: "SCORE"
      gamePlayUuid: string
      score: number
      challengeNumber: number
    }
  | { type: "ERR"; gamePlayUuid: string; errMsg: string }
  | { type: "WARNING"; gamePlayUuid: string; msg: string }
  | {
      type: "WINDOW_ERR"
      err: {
        msg: string
        filename: string
        lineno: number
        colno: number
      }
    }
  | { type: "BROWSER_INITIAL_OVERLAY_CLICKED" }
  | { type: "BROWSER_IFRAME_LOADED" }

export type RuneAppCommand =
  | { type: "pauseGame" | "requestScore" }
  | { type: "playGame" | "restartGame"; gamePlayUuid: string }
  | { type: "setForceMuteStatus"; muted: boolean }
