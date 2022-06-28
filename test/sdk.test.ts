import {
  extractErrMsg,
  initRune,
  runePostMessageHandler,
  sendRuneAppCommand,
  simulateNativeApp,
} from "./helper"
import { getRuneSdk } from "../src"
import { RuneGameEvent } from "../src/types"

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

  test("alternative way of providing the score using reference on getScore", async () => {
    const { Rune, stateMachineService } = getRuneSdk({ challengeNumber })

    let score: number = 0

    function getScore() {
      getScore.score = score
    }
    getScore.callbackReturnValueNotSupported = true as const

    // this line is just to make typescript happy within the context of this test
    getScore.score = 0

    initRune(Rune, { getScore })

    let scoreEvent: Extract<RuneGameEvent, { type: "SCORE" }> | undefined

    runePostMessageHandler((event) => {
      if (event.type === "SCORE") {
        scoreEvent = event
      }
    })

    score = 33
    sendRuneAppCommand(stateMachineService, { type: "requestScore" })
    expect(scoreEvent?.score).toEqual(33)
  })

  test("exposed version should match npm version", async function () {
    const { Rune } = getRuneSdk({ challengeNumber })
    const packageJson = require("../package.json")
    expect(packageJson.version).toMatch(Rune.version)
  })

  test("INIT event should include version matching npm version", async function () {
    const { Rune } = getRuneSdk({ challengeNumber })
    const packageJson = require("../package.json")

    let initEvent: Extract<RuneGameEvent, { type: "INIT" }> | undefined

    runePostMessageHandler((event) => {
      if (event.type === "INIT") {
        initEvent = event
      }
    })

    initRune(Rune)

    expect(initEvent?.version).toBe(packageJson.version)
  })

  test("SCORE event should include score from game's getScore(), game play uuid and challenge number after requesting score", async function () {
    const customChallengeNumber = 123

    const { Rune, stateMachineService } = getRuneSdk({
      challengeNumber: customChallengeNumber,
    })
    // Init with mock functions to get and set score
    let gameScore = 0
    const getScore = () => {
      return gameScore
    }
    const restartGame = () => {
      // Mock game reseting its local score
      gameScore = 0
    }
    initRune(Rune, { getScore, restartGame })

    // Override postRuneEvent to extract score
    let scoreEvent: Extract<RuneGameEvent, { type: "SCORE" }> | undefined

    runePostMessageHandler((event) => {
      if (event.type === "SCORE") {
        scoreEvent = event
      }
    })

    sendRuneAppCommand(stateMachineService, {
      type: "playGame",
      gamePlayUuid: "1",
    })
    // Mock game updating its local score
    gameScore = 100
    sendRuneAppCommand(stateMachineService, { type: "requestScore" })

    // Score event should contain score achieved in the game
    expect(scoreEvent?.score).toEqual(100)
    expect(scoreEvent?.challengeNumber).toEqual(customChallengeNumber)
    expect(scoreEvent?.gamePlayUuid).toEqual("1")
  })

  test("SCORE event should include score from game's getScore(), game play uuid and challenge number after game restart", async function () {
    const customChallengeNumber = 123

    const { Rune, stateMachineService } = getRuneSdk({
      challengeNumber: customChallengeNumber,
    })
    // Init with mock functions to get and set score
    let gameScore = 0
    const getScore = () => {
      return gameScore
    }
    const restartGame = () => {
      // Mock game reseting its local score
      gameScore = 0
    }
    initRune(Rune, { getScore, restartGame })

    // Override postRuneEvent to extract score
    let scoreEvent: Extract<RuneGameEvent, { type: "SCORE" }> | undefined

    runePostMessageHandler((event) => {
      if (event.type === "SCORE") {
        scoreEvent = event
      }
    })

    sendRuneAppCommand(stateMachineService, {
      type: "playGame",
      gamePlayUuid: "1",
    })
    // Mock game updating its local score
    gameScore = 100
    sendRuneAppCommand(stateMachineService, {
      type: "restartGame",
      gamePlayUuid: "2",
    })

    // Score event should contain score achieved in the game
    expect(scoreEvent?.score).toEqual(100)
    expect(scoreEvent?.challengeNumber).toEqual(customChallengeNumber)
    expect(scoreEvent?.gamePlayUuid).toEqual("1")
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
    let scoreEvent: Extract<RuneGameEvent, { type: "SCORE" }> | undefined

    runePostMessageHandler((event) => {
      if (event.type === "SCORE") {
        scoreEvent = event
      }
    })
    // Mock game updating its local score and extract using _requestScore
    gameScore = 100

    sendRuneAppCommand(stateMachineService, {
      type: "playGame",
      gamePlayUuid: "1",
    })
    sendRuneAppCommand(stateMachineService, {
      type: "restartGame",
      gamePlayUuid: "2",
    })
    sendRuneAppCommand(stateMachineService, { type: "_requestScore" })
    expect(scoreEvent?.score).toEqual(gameScore)
    expect(scoreEvent?.challengeNumber).toEqual(customChallengeNumber)
    expect(scoreEvent?.gamePlayUuid).toEqual("2")
  })

  test("GAME_OVER event should include score from game's getScore(), game play uuid and challenge number", async function () {
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
    let gameOverEvent: Extract<RuneGameEvent, { type: "GAME_OVER" }> | undefined

    runePostMessageHandler((event) => {
      if (event.type === "GAME_OVER") {
        gameOverEvent = event
      }
    })

    // Mock game updating its local score and extract using gameOver
    gameScore = 100
    sendRuneAppCommand(stateMachineService, {
      type: "playGame",
      gamePlayUuid: "1",
    })
    Rune.gameOver()
    expect(gameOverEvent?.score).toEqual(gameScore)
    expect(gameOverEvent?.challengeNumber).toEqual(customChallengeNumber)
    expect(gameOverEvent?.gamePlayUuid).toEqual("1")
  })

  describe("error state", () => {
    test("ERR event should be sent when init is called multiple times", () => {
      const { Rune } = getRuneSdk({ challengeNumber })

      let errEvent: Extract<RuneGameEvent, { type: "ERR" }> | undefined

      runePostMessageHandler((event) => {
        if (event.type === "ERR") {
          errEvent = event
        }
      })

      initRune(Rune)
      initRune(Rune)

      expect(errEvent?.errMsg).toEqual(
        "Fatal issue: Received onGameInit while in INIT.PAUSED"
      )
      expect(errEvent?.gamePlayUuid).toEqual("UNSET")
    })

    test("ERR event should be sent when game over is without initialization", () => {
      const { Rune } = getRuneSdk({ challengeNumber })

      let errEvent: Extract<RuneGameEvent, { type: "ERR" }> | undefined

      runePostMessageHandler((event) => {
        if (event.type === "ERR") {
          errEvent = event
        }
      })

      Rune.gameOver()

      expect(errEvent?.errMsg).toEqual(
        "Fatal issue: Received onGameOver while in LOADING"
      )
      expect(errEvent?.gamePlayUuid).toEqual("UNSET")
    })

    test("ERR event should be sent when game over is called during pause", () => {
      const { Rune } = getRuneSdk({ challengeNumber })

      let errEvent: Extract<RuneGameEvent, { type: "ERR" }> | undefined

      runePostMessageHandler((event) => {
        if (event.type === "ERR") {
          errEvent = event
        }
      })

      initRune(Rune)
      Rune.gameOver()

      expect(errEvent?.errMsg).toEqual(
        "Fatal issue: Received onGameOver while in INIT.PAUSED"
      )
      expect(errEvent?.gamePlayUuid).toEqual("UNSET")
    })

    test("ERR event should be sent when game over is called multiple times in a row", () => {
      const { Rune, stateMachineService } = getRuneSdk({ challengeNumber })

      let errEvent: Extract<RuneGameEvent, { type: "ERR" }> | undefined

      runePostMessageHandler((event) => {
        if (event.type === "ERR") {
          errEvent = event
        }
      })

      initRune(Rune)
      sendRuneAppCommand(stateMachineService, {
        type: "playGame",
        gamePlayUuid: "1",
      })
      Rune.gameOver()
      Rune.gameOver()

      expect(errEvent?.errMsg).toEqual(
        "Fatal issue: Received onGameOver while in INIT.GAME_OVER"
      )
      expect(errEvent?.gamePlayUuid).toEqual("1")
    })
  })

  test("WARNING event should be sent when handling unexpected events", async function () {
    const { Rune, stateMachineService } = getRuneSdk({ challengeNumber })
    initRune(Rune)

    let warningEvent: Extract<RuneGameEvent, { type: "WARNING" }> | undefined
    runePostMessageHandler((event) => {
      if (event.type === "WARNING") {
        warningEvent = event
      }
    })

    sendRuneAppCommand(stateMachineService, {
      type: "playGame",
      gamePlayUuid: "1",
    })
    sendRuneAppCommand(stateMachineService, { type: "pauseGame" })
    sendRuneAppCommand(stateMachineService, { type: "pauseGame" })
    expect(warningEvent?.msg).toEqual(
      "Received onAppPause while in INIT.PAUSED"
    )
    expect(warningEvent?.gamePlayUuid).toEqual("1")
  })
})
