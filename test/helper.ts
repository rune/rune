import { InitInput, RuneExport } from "../src"
import {
  RuneGameEvent,
  LegacyRuneGameCommand,
  RuneAppCommand,
  getRuneGameEvent,
  stringifyRuneGameCommand,
} from "../src/api"
import { messageEventHandler } from "../src/internal/setupMessageBridge"
import { StateMachineService } from "../src/internal/stateMachine"

export async function extractErrMsg(fn: Function) {
  let errMsg
  try {
    await fn()
  } catch (err: any) {
    errMsg = err.message
  }
  return errMsg
}

export function runePostMessageHandler(
  handler?: (event: RuneGameEvent) => void
) {
  globalThis.ReactNativeWebView = {
    postMessage: jest.fn().mockImplementation((data) => {
      const parsedEvent = getRuneGameEvent(data)
      if (parsedEvent === null) {
        return
      }

      handler?.(parsedEvent)
    }),
  }
}

export function sendRuneAppCommand(
  stateMachineService: StateMachineService,
  command: RuneAppCommand | LegacyRuneGameCommand
) {
  messageEventHandler(stateMachineService)(
    new MessageEvent("message", {
      data: stringifyRuneGameCommand(command),
    })
  )
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
    restartGame: () => {},
    pauseGame: () => {},
    resumeGame: () => {},
    getScore: () => {
      return 0
    },
    ...overrides,
  })
}
