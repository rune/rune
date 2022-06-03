import {
  extractErrMsg,
  initRune,
  runePostMessageHandler,
  sendRuneAppCommand,
  simulateNativeApp,
} from "./helper"
import { getRuneSdk } from "../src"

const challengeNumber = 1

beforeEach(async () => {
  simulateNativeApp()
})

describe("sdk", function () {
  test("ensure correct properties passed to init()", async function () {
    const { Rune } = getRuneSdk({ challengeNumber })

    expect(
      await extractErrMsg(() => {
        // @ts-expect-error
        Rune.init()
      })
    ).toMatchInlineSnapshot(
      `"Invalid resumeGame function provided to Rune.init()"`
    )
  })

  test("ensure correct types passed to init()", async function () {
    const { Rune } = getRuneSdk({ challengeNumber })
    expect(
      await extractErrMsg(() => {
        Rune.init({
          startGame: () => {},
          // @ts-ignore
          resumeGame: "sure",
          // @ts-ignore
          pauseGame: "sometimes",
        })
      })
    ).toMatchInlineSnapshot(
      `"Invalid resumeGame function provided to Rune.init()"`
    )
  })

  test("ensure score passed as number", async function () {
    const { Rune } = getRuneSdk({ challengeNumber })
    expect(
      await extractErrMsg(() => {
        initRune(Rune, {
          // @ts-expect-error
          getScore: () => {
            return "99"
          },
        })
      })
    ).toMatchInlineSnapshot(`"Score is not a number. Received: string"`)
  })

  test("exposed version should match npm version", async function () {
    const { Rune } = getRuneSdk({ challengeNumber })
    const packageJson = require("../package.json")
    expect(packageJson.version).toMatch(Rune.version)
  })

  test("INIT event should include version matching npm version", async function () {
    const { Rune } = getRuneSdk({ challengeNumber })
    const packageJson = require("../package.json")

    let version: string | undefined

    runePostMessageHandler((event) => {
      if (event.type === "INIT") {
        version = event.version
      }
    })

    initRune(Rune)

    expect(packageJson.version).toBe(version)
  })

  test("SCORE event should include score from game's getScore() and challenge number", async function () {
    const customChallengeNumber = 123

    const { Rune, stateMachineService } = getRuneSdk({
      challengeNumber: customChallengeNumber,
    })
    // Init with score function
    let gameScore = 0
    const getScore = () => {
      return gameScore
    }
    initRune(Rune, { getScore })

    // Override postRuneEvent to extract score
    let eventScore: number | undefined
    let eventChallengeNumber: number | undefined

    runePostMessageHandler((event) => {
      if (event.type === "SCORE") {
        eventScore = event.score
        eventChallengeNumber = event.challengeNumber
      }
    })
    // Mock game updating its local score and extract using _requestScore
    gameScore = 100

    sendRuneAppCommand(stateMachineService, { type: "requestScore" })
    expect(eventScore).toEqual(gameScore)
    expect(eventChallengeNumber).toEqual(customChallengeNumber)
  })

  test("should support legacy _requestScore command", async function () {
    const customChallengeNumber = 123
    const { Rune, stateMachineService } = getRuneSdk({
      challengeNumber: customChallengeNumber,
    })
    // Init with score function
    let gameScore = 0
    const getScore = () => {
      return gameScore
    }
    initRune(Rune, { getScore })

    // Override postRuneEvent to extract score
    let eventScore: number | undefined
    let eventChallengeNumber: number | undefined

    runePostMessageHandler((event) => {
      if (event.type === "SCORE") {
        eventScore = event.score
        eventChallengeNumber = event.challengeNumber
      }
    })
    // Mock game updating its local score and extract using _requestScore
    gameScore = 100

    sendRuneAppCommand(stateMachineService, { type: "_requestScore" })
    expect(eventScore).toEqual(gameScore)
    expect(eventChallengeNumber).toEqual(customChallengeNumber)
  })

  test("GAME_OVER event should include score from game's getScore() and challenge number", async function () {
    const customChallengeNumber = 123
    const { Rune, stateMachineService } = getRuneSdk({
      challengeNumber: customChallengeNumber,
    })
    // Init with score function
    let gameScore = 0
    const getScore = () => {
      return gameScore
    }
    initRune(Rune, { getScore })

    // Override postRuneEvent to extract score and challenge number
    let eventScore: number | undefined
    let eventChallengeNumber: number | undefined

    runePostMessageHandler((event) => {
      if (event.type === "GAME_OVER") {
        eventScore = event.score
        eventChallengeNumber = event.challengeNumber
      }
    })

    // Mock game updating its local score and extract using gameOver
    gameScore = 100
    sendRuneAppCommand(stateMachineService, { type: "playGame", gamePlayUuid: '1' })
    Rune.gameOver()
    expect(eventScore).toEqual(gameScore)
    expect(eventChallengeNumber).toEqual(customChallengeNumber)
  })

  describe("error state", () => {
    test("ERR event should be sent when init is called multiple times", () => {
      const { Rune } = getRuneSdk({ challengeNumber })

      let error: string | null = null

      runePostMessageHandler((event) => {
        if (event.type === "ERR") {
          error = event.errMsg
        }
      })

      initRune(Rune)
      initRune(Rune)

      expect(error).toEqual(
        "Fatal issue: Received onGameInit while in INIT.PAUSED"
      )
    })

    test("ERR event should be sent when game over is without initialization", () => {
      const { Rune } = getRuneSdk({ challengeNumber })

      let error: string | null = null

      runePostMessageHandler((event) => {
        if (event.type === "ERR") {
          error = event.errMsg
        }
      })

      Rune.gameOver()

      expect(error).toEqual("Fatal issue: Received onGameOver while in LOADING")
    })

    test("ERR event should be sent when  game over is called during pause", () => {
      const { Rune } = getRuneSdk({ challengeNumber })

      let error: string | null = null

      runePostMessageHandler((event) => {
        if (event.type === "ERR") {
          error = event.errMsg
        }
      })

      initRune(Rune)
      Rune.gameOver()

      expect(error).toEqual(
        "Fatal issue: Received onGameOver while in INIT.PAUSED"
      )
    })

    test("ERR event should be sent when game over is called multiple times in a row", () => {
      const { Rune, stateMachineService } = getRuneSdk({ challengeNumber })

      let error: string | null = null

      runePostMessageHandler((event) => {
        if (event.type === "ERR") {
          error = event.errMsg
        }
      })

      initRune(Rune)
      sendRuneAppCommand(stateMachineService, { type: "playGame", gamePlayUuid: '1' })
      Rune.gameOver()
      Rune.gameOver()

      expect(error).toEqual(
        "Fatal issue: Received onGameOver while in INIT.GAME_OVER"
      )
    })
  })

  test("WARNING event should be sent when handling unexpected events", async function () {
    const { Rune, stateMachineService } = getRuneSdk({ challengeNumber })
    initRune(Rune)

    let msg = ""
    runePostMessageHandler((event) => {
      if (event.type === "WARNING") {
        msg = event.msg
      }
    })

    sendRuneAppCommand(stateMachineService, { type: "pauseGame" })
    expect(msg).toEqual("Received onAppPause while in INIT.PAUSED")
  })
})
