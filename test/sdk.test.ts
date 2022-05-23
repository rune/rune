import {
  extractErrMsg,
  initRune,
  runePostMessageHandler,
  sendRuneAppCommand,
  simulateNativeApp,
} from "./helper"
import { getRuneSdk } from "../src/sdk"

const CHALLENGE_NUMBER = 123

beforeEach(async () => {
  simulateNativeApp()
})

describe("sdk", function () {
  test("ensure correct properties passed to init()", async function () {
    const { Rune } = getRuneSdk(1)

    expect(
      await extractErrMsg(() => {
        //@ts-expect-error
        Rune.init()
      })
    ).toMatchInlineSnapshot(`"Invalid resumeGame function provided to Rune.init()"`)
  })

  test("ensure correct types passed to init()", async function () {
    const { Rune } = getRuneSdk(1)
    expect(
      await extractErrMsg(() => {
        //@ts-expect-error
        Rune.init({ startGame: () => {}, resumeGame: "sure", pauseGame: "sometimes" })
      })
    ).toMatchInlineSnapshot(`"Invalid resumeGame function provided to Rune.init()"`)
  })

  test("ensure score passed as number", async function () {
    const { Rune } = getRuneSdk(1)
    expect(
      await extractErrMsg(() => {
        initRune(Rune, {
          //@ts-expect-error
          getScore: () => {
            return "99"
          },
        })
      })
    ).toMatchInlineSnapshot(`"Score is not a number. Received: string"`)
  })

  test("exposed version should match npm version", async function () {
    const { Rune } = getRuneSdk(1)
    const packageJson = require("../package.json")
    expect(packageJson.version).toMatch(Rune.version)
  })

  test("INIT event should include version matching npm version", async function () {
    const { Rune } = getRuneSdk(1)
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
    const { Rune, stateMachineService } = getRuneSdk(CHALLENGE_NUMBER)
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
    expect(eventChallengeNumber).toEqual(CHALLENGE_NUMBER)
  })

  test("should support legacy _requestScore command", async function () {
    const { Rune, stateMachineService } = getRuneSdk(CHALLENGE_NUMBER)
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
    expect(eventChallengeNumber).toEqual(CHALLENGE_NUMBER)
  })

  test("GAME_OVER event should include score from game's getScore() and challenge number", async function () {
    const { Rune, stateMachineService } = getRuneSdk(CHALLENGE_NUMBER)
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
    sendRuneAppCommand(stateMachineService, { type: "playGame" })
    Rune.gameOver()
    expect(eventScore).toEqual(gameScore)
    expect(eventChallengeNumber).toEqual(CHALLENGE_NUMBER)
  })
})
