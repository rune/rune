import { Rune } from "./setup"
import { extractErrMsg } from "./helper"

describe("sdk", function () {
  test("init() -> startGame() -> pauseGame() -> resumeGame()", async function () {
    // Mock a game's state and mimic running inside Rune where env is set
    process.env.RUNE_PLATFORM = "MOBILE"
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

  test("ensure correct input passed to init()", async function () {
    expect(
      await extractErrMsg(() => {
        //@ts-expect-error
        Rune.init()
      })
    ).toMatchInlineSnapshot(`"Invalid startGame function provided to Rune.init()"`)

    expect(
      await extractErrMsg(() => {
        //@ts-expect-error
        Rune.init({ startGame: () => {}, resumeGame: "sure", pauseGame: "sometimes" })
      })
    ).toMatchInlineSnapshot(`"Invalid resumeGame function provided to Rune.init()"`)
  })

  test("exposed version should match npm version", async function () {
    const packageJson = require("../package.json")
    expect(packageJson.version).toMatch(Rune.version)
  })

  test("allow replacing functions to communicate with the Rune app", async function () {
    let gameFinished = false

    // Mimic running inside Rune, where gameOver() is replaced using code injection
    Rune.gameOver = ({}) => {
      gameFinished = true
    }
    process.env.RUNE_PLATFORM = "MOBILE"

    // See that the injected gameOver() is used
    Rune.gameOver({ score: 0 })
    expect(gameFinished).toEqual(true)

    // See that calling init() doesn't overwrite injected gameOver()
    gameFinished = false
    Rune.init({ startGame: () => {}, pauseGame: () => {}, resumeGame: () => {} })
    Rune.gameOver({ score: 0 })
    expect(gameFinished).toEqual(true)
  })
})
