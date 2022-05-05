import { getRuneGameEvent, InitInput, RuneExport } from "../src"
import { RuneGameEvent } from "../src/types"

export async function extractErrMsg(fn: Function) {
  let errMsg
  try {
    await fn()
  } catch (err: any) {
    errMsg = err.message
  }
  return errMsg
}

export function runePostMessageHandler(handler?: (event: RuneGameEvent) => void) {
  globalThis.ReactNativeWebView = {
    postMessage: jest.fn().mockImplementation((event) => {
      const messageEvent = new MessageEvent("message", { data: event })

      const parsedEvent = getRuneGameEvent(messageEvent)
      if (parsedEvent === null) {
        return
      }

      handler?.(parsedEvent)
    }),
  }
}

export function simulateNativeApp() {
  runePostMessageHandler()
}

export function simulateIframe() {
  delete globalThis.ReactNativeWebView

  Object.defineProperty(globalThis, "parent", {
    value: {
      postMessage: jest.fn(),
    },
  })
}

export function initRune(Rune: RuneExport, overrides: Partial<InitInput> = {}) {
  Rune.init({
    startGame: () => {},
    pauseGame: () => {},
    resumeGame: () => {},
    getScore: () => {
      return 0
    },
    ...overrides,
  })
}
