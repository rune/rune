import * as bridgeModule from "../src/internal/setupMessageBridge"
import { RuneExport, getRuneGameEvent, stringifyRuneGameCommand } from "../src"

let setupMessageBridge: typeof bridgeModule.setupMessageBridge
let Rune: RuneExport

beforeEach(async () => {
  // Reimport of the Rune module between every test
  delete globalThis._runeChallengeNumber
  delete globalThis.ReactNativeWebView
  delete globalThis.Rune

  jest.resetModules()
  setupMessageBridge = (await import("../src/internal/setupMessageBridge"))
    .setupMessageBridge
  Rune = (await import("../src")).Rune
})

describe("Message Bridge", () => {
  describe("Rune Game Events", () => {
    test("should use ReactNativeWebView postMessage if it is available", () => {
      globalThis.ReactNativeWebView = {
        postMessage: jest.fn(),
      }
      globalThis.parent.postMessage = jest.fn()

      setupMessageBridge()

      Rune.init({
        startGame: () => {},
        pauseGame: () => {},
        resumeGame: () => {},
        getScore: () => {
          return 0
        },
      })

      expect(globalThis.ReactNativeWebView.postMessage).toHaveBeenCalled()
      expect(globalThis.parent.postMessage).not.toHaveBeenCalled()
    })

    test("should use iframe postMessage if ReactNativeWebView is not available", () => {
      globalThis.parent.postMessage = jest.fn()

      setupMessageBridge()

      Rune.init({
        startGame: () => {},
        pauseGame: () => {},
        resumeGame: () => {},
        getScore: () => {
          return 0
        },
      })

      expect(globalThis.parent.postMessage).toHaveBeenCalled()
    })

    test("should stringify the passed content", () => {
      let message: MessageEvent
      globalThis.ReactNativeWebView = {
        postMessage: jest.fn().mockImplementation((event) => {
          message = new MessageEvent("message", { data: event })
        }),
      }

      setupMessageBridge()

      Rune.init({
        startGame: () => {},
        pauseGame: () => {},
        resumeGame: () => {},
        getScore: () => {
          return 0
        },
      })

      expect(getRuneGameEvent(message)).toEqual(
        expect.objectContaining({
          type: "INIT",
          version: Rune.version,
        })
      )
    })
  })

  describe("Rune Game Commands", () => {
    test("should listen to post messages", () => {
      globalThis.Rune = Rune
      const startGame = jest.fn()
      setupMessageBridge()

      Rune.init({
        startGame,
        pauseGame: () => {},
        resumeGame: () => {},
        getScore: () => {
          return 0
        },
      })

      const messageEvent = new MessageEvent("message", {
        data: stringifyRuneGameCommand({ type: "_startGame" }),
      })

      globalThis.dispatchEvent(messageEvent)
      expect(startGame).toHaveBeenCalled()
    })
  })
})
