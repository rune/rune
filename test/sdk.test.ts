import { Rune } from "./setup"
import { extractErrMsg } from "./helper"

describe("sdk", function () {
  it("init() -> pauseGame() -> gameOver() -> startGame()", async function () {
    // Mock a game's state
    let gameState: "OFF" | "RUNNING" | "PAUSED" = "OFF"
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
    expect(gameState).toMatchInlineSnapshot(`"OFF"`)

    // Should start the game
    Rune.startGame()
    expect(gameState).toMatchInlineSnapshot(`"RUNNING"`)

    // Should pause the game
    Rune.pauseGame()
    expect(gameState).toMatchInlineSnapshot(`"PAUSED"`)

    // Should restart the game a bit after providing score
    Rune.gameOver({ score: 0 })
    expect(gameState).toMatchInlineSnapshot(`"PAUSED"`)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    expect(gameState).toMatchInlineSnapshot(`"RUNNING"`)
  })

  it("don't allow calling other functions before init()", async function () {
    const errMsg = await extractErrMsg(() => {
      Rune.startGame()
    })
    expect(errMsg).toMatchInlineSnapshot(`"Rune.startGame() called before Rune.init()"`)
  })

  it("exposed version should match npm version", async function () {
    const packageJson = require("../package.json")
    expect(packageJson.version).toMatch(Rune.version)
  })
})
