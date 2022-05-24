import { stringifyRuneGameCommand, RuneGameEvent } from "../src/api"
import { RuneExport, getRuneSdk } from "../src"
import {
  messageEventHandler,
  setupMessageBridge,
} from "../src/internal/setupMessageBridge"
import {
  extractErrMsg,
  initRune,
  simulateNativeApp,
  runePostMessageHandler,
  simulateIframe,
} from "./helper"
import { StateMachineService } from "../src/internal/stateMachine"

let Rune: RuneExport
let stateMachineService: StateMachineService

beforeEach(async () => {
  simulateNativeApp()

  const instance = getRuneSdk(1)
  stateMachineService = instance.stateMachineService
  Rune = instance.Rune
})

describe("Message Bridge", () => {
  describe("Rune Game Events", () => {
    test("should use ReactNativeWebView postMessage if it is available", () => {
      globalThis.ReactNativeWebView = {
        postMessage: jest.fn(),
      }
      globalThis.parent.postMessage = jest.fn()

      initRune(Rune)

      expect(globalThis.ReactNativeWebView.postMessage).toHaveBeenCalled()
      expect(globalThis.parent.postMessage).not.toHaveBeenCalled()
    })

    test("should use iframe postMessage if ReactNativeWebView is not available", () => {
      simulateIframe()

      initRune(Rune)

      expect(globalThis.parent.postMessage).toHaveBeenCalled()
    })

    test("should stringify the passed event", () => {
      let event: RuneGameEvent | null = null
      runePostMessageHandler((e) => {
        event = e
      })

      initRune(Rune)

      expect(event).toEqual({
        type: "INIT",
        version: Rune.version,
      })
    })
  })

  describe("Rune Game Commands", () => {
    test("should listen to post messages on window by default", () => {
      const resumeGame = jest.fn()

      const eventHandler = setupMessageBridge(stateMachineService, false)

      initRune(Rune, { resumeGame })

      const messageEvent = new MessageEvent("message", {
        data: stringifyRuneGameCommand({ type: "playGame" }),
      })

      globalThis.dispatchEvent(messageEvent)

      //Cleanup event listener to not impact other tests
      globalThis.removeEventListener("message", eventHandler)

      expect(resumeGame).toHaveBeenCalled()
    })

    test("should listen to post messages on document in case of native app on android", () => {
      const resumeGame = jest.fn()

      const eventHandler = setupMessageBridge(stateMachineService, true)

      initRune(Rune, { resumeGame })

      const messageEvent = new MessageEvent("message", {
        data: stringifyRuneGameCommand({ type: "playGame" }),
      })

      document.dispatchEvent(messageEvent)

      //Cleanup event listener to not impact other tests
      document.removeEventListener("message" as any, eventHandler)

      expect(resumeGame).toHaveBeenCalled()
    })

    test("should silently ignore non rune commands", async () => {
      initRune(Rune)

      const messageEvent = new MessageEvent("message", {
        data: "Some random command",
      })

      globalThis.dispatchEvent(messageEvent)

      messageEventHandler(stateMachineService)(messageEvent)

      //Sanity check to confirm that no error was raised
      expect(true).toEqual(true)
    })

    test("should silently ignore non rune commands", async () => {
      const badEvent = "bad command"
      initRune(Rune)

      const messageEvent = new MessageEvent("message", {
        data: stringifyRuneGameCommand(badEvent as any),
      })

      expect(
        await extractErrMsg(() => {
          messageEventHandler(stateMachineService)(messageEvent)
        })
      ).toEqual(`Received incorrect message: ${badEvent}`)
    })
  })
})
