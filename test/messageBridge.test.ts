import { RuneExport, stringifyRuneGameCommand, getRuneSdk } from "../src"
import {
  messageEventHandler,
  setupMessageBridge,
} from "../src/internal/setupMessageBridge"
import { extractErrMsg, initRune, runePostMessageHandler } from "./helper"
import { RuneGameEvent } from "../src/types"

let Rune: RuneExport

beforeEach(async () => {
  delete globalThis.ReactNativeWebView
  delete globalThis.postRuneEvent

  Rune = getRuneSdk()
})

describe("Message Bridge", () => {
  describe("Rune Game Events", () => {
    test("should use legacy postMessage if it is available", () => {
      globalThis.postRuneEvent = jest.fn()

      initRune(Rune)

      expect(globalThis.postRuneEvent).toHaveBeenCalledWith({
        type: "INIT",
        version: Rune.version,
      })
    })

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
      globalThis.parent.postMessage = jest.fn()

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
    test("should listen to post messages", () => {
      const startGame = jest.fn()

      //Simulate emitting a real message event
      const eventHandler = setupMessageBridge(Rune)

      initRune(Rune, { startGame })

      const messageEvent = new MessageEvent("message", {
        data: stringifyRuneGameCommand({ type: "_startGame" }),
      })

      globalThis.dispatchEvent(messageEvent)

      //Cleanup event listener to not impact other tests
      removeEventListener("message", eventHandler)

      expect(startGame).toHaveBeenCalled()
    })

    test("should silently ignore non rune commands", async () => {
      initRune(Rune)

      const messageEvent = new MessageEvent("message", {
        data: "Some random command",
      })

      globalThis.dispatchEvent(messageEvent)

      messageEventHandler(Rune)(messageEvent)

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
          messageEventHandler(Rune)(messageEvent)
        })
      ).toEqual(`Received incorrect message: ${badEvent}`)
    })
  })
})
