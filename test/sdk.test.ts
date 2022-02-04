import { Rune } from "./setup"
import { extractErrMsg } from "./helper"

describe("sdk", function () {
  test("init() -> startGame() -> pauseGame() -> resumeGame()", async function () {
    // Mock a game's state and mimic running inside Rune where env is set
    globalThis.postRuneEvent = () => {}
    let gameState: "WAITING" | "RUNNING" | "PAUSED" = "WAITING"
    Rune.init({
      startGame: () => {
        gameState = "RUNNING"
      },
      pauseGame: () => {
        gameState = "PAUSED"
      },
      resumeGame: () => {
        gameState = "RUNNING"
      },
      getScore: () => {
        return 0
      },
    })

    // Should be no change in gameState from calling init()
    expect(gameState).toMatchInlineSnapshot(`"WAITING"`)

    // Should start the game
    Rune._startGame()
    expect(gameState).toMatchInlineSnapshot(`"RUNNING"`)

    // Should pause the game
    Rune._pauseGame()
    expect(gameState).toMatchInlineSnapshot(`"PAUSED"`)

    // Should resume the game
    Rune._resumeGame()
    expect(gameState).toMatchInlineSnapshot(`"RUNNING"`)
  })

  test("don't allow calling other functions before init()", async function () {
    expect(
      await extractErrMsg(() => {
        Rune._startGame()
      })
    ).toMatchInlineSnapshot(`"Rune._startGame() called before Rune.init()"`)
  })

  test("ensure correct properties passed to init()", async function () {
    expect(
      await extractErrMsg(() => {
        //@ts-expect-error
        Rune.init()
      })
    ).toMatchInlineSnapshot(`"Invalid startGame function provided to Rune.init()"`)
  })

  test("ensure correct types passed to init()", async function () {
    expect(
      await extractErrMsg(() => {
        //@ts-expect-error
        Rune.init({ startGame: () => {}, resumeGame: "sure", pauseGame: "sometimes" })
      })
    ).toMatchInlineSnapshot(`"Invalid resumeGame function provided to Rune.init()"`)
  })

  test("ensure score passed as number", async function () {
    expect(
      await extractErrMsg(() => {
        Rune.init({
          startGame: () => {},
          resumeGame: () => {},
          pauseGame: () => {},
          //@ts-expect-error
          getScore: () => {
            return "99"
          },
        })
      })
    ).toMatchInlineSnapshot(`"Score is not a number. Received: string"`)
  })

  test("exposed version should match npm version", async function () {
    const packageJson = require("../package.json")
    expect(packageJson.version).toMatch(Rune.version)
  })

  test("INIT event should include version matching npm version", async function () {
    const packageJson = require("../package.json")

    let version: string | undefined
    globalThis.postRuneEvent = (event) => {
      if (event.type === "INIT") {
        version = event.version
      }
    }

    Rune.init({
      startGame: () => {},
      pauseGame: () => {},
      resumeGame: () => {},
      getScore: () => {
        return 0
      },
    })

    expect(packageJson.version).toBe(version)
  })

  test("SCORE event should include score from game's getScore()", async function () {
    // Init with score function
    let gameScore = 0
    const getScore = () => {
      return gameScore
    }
    Rune.init({
      startGame: () => {},
      pauseGame: () => {},
      resumeGame: () => {},
      getScore: getScore,
    })

    // Override postRuneEvent to extract score
    let eventScore: number | undefined
    globalThis.postRuneEvent = (event) => {
      if (event.type === "SCORE") {
        eventScore = event.score
      }
    }

    // Mock game updating its local score and extract using _requestScore
    gameScore = 100
    Rune._requestScore()
    expect(eventScore).toEqual(gameScore)
  })

  test("allow replacing functions through code injection", async function () {
    let gameFinished = false

    // Mimic running inside Rune, where gameOver() is replaced using code injection
    Rune.gameOver = () => {
      gameFinished = true
    }
    globalThis.postRuneEvent = () => {}

    // See that the injected gameOver() is used
    Rune.gameOver()
    expect(gameFinished).toEqual(true)

    // See that calling init() doesn't overwrite injected gameOver()
    gameFinished = false
    Rune.init({
      startGame: () => {},
      pauseGame: () => {},
      resumeGame: () => {},
      getScore: () => {
        return 0
      },
    })
    Rune.gameOver()
    expect(gameFinished).toEqual(true)
  })

  test("get challenge number if not injected", async function () {
    const challengeNumber = Rune.getChallengeNumber();

    // See that default challenge number is 1
    expect(challengeNumber).toEqual(1)
  })

  test("get challenge number if injected", async function () {
    globalThis._runeChallengeNumber = 123
    const challengeNumber = Rune.getChallengeNumber();

    // See that challenge number is correct
    expect(challengeNumber).toEqual(123)
  })
})
