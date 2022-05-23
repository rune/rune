import {
  initRune,
  runePostMessageHandler,
  sendRuneAppCommand,
  simulateNativeApp,
} from "./helper"
import { getRuneSdk } from "../src/sdk"
import { LegacyRuneGameCommand, RuneAppCommand } from "../src"

type GameStates = "WAITING" | "RESUMED" | "PAUSED" | "RESTARTED" | "GAME_OVER"

function testStateMachine(
  steps: [RuneAppCommand | LegacyRuneGameCommand | "SDK_GAME_OVER", GameStates][]
) {
  const { Rune, stateMachineService } = getRuneSdk(1)

  let gameState: GameStates = "WAITING"
  initRune(Rune, {
    pauseGame: () => {
      gameState = "PAUSED"
    },
    restartGame: () => {
      gameState = "RESTARTED"
    },
    resumeGame: () => {
      gameState = "RESUMED"
    },
  })

  runePostMessageHandler((event) => {
    if (event.type === "GAME_OVER") {
      gameState = "GAME_OVER"
    }
  })

  // Should be no change in gameState from calling init()
  expect(gameState).toMatchInlineSnapshot(`"WAITING"`)

  steps.forEach(([command, expectedState]) => {
    if (command === "SDK_GAME_OVER") {
      Rune.gameOver()
    } else {
      sendRuneAppCommand(stateMachineService, command)
    }

    expect(gameState).toMatch(expectedState)
  })
}

beforeEach(async () => {
  simulateNativeApp()
})

describe("stateMachine", function () {
  test("User starts the game, clicks pause and clicks play again", async function () {
    testStateMachine([
      [{ type: "playGame" }, "RESUMED"],
      [{ type: "pauseGame" }, "PAUSED"],
      [{ type: "playGame" }, "RESUMED"],
    ])
  })

  test("User starts the game, clicks restart", async function () {
    testStateMachine([
      [{ type: "playGame" }, "RESUMED"],
      [{ type: "restartGame" }, "RESTARTED"],
    ])
  })

  test("User starts the game, loses it, and starts to play again", async function () {
    testStateMachine([
      [{ type: "playGame" }, "RESUMED"],
      ["SDK_GAME_OVER", "GAME_OVER"],
      [{ type: "playGame" }, "RESTARTED"],
    ])
  })

  test("User starts the game, loses it, starts to play again, pauses, resumes", async function () {
    testStateMachine([
      [{ type: "playGame" }, "RESUMED"],
      ["SDK_GAME_OVER", "GAME_OVER"],
      [{ type: "playGame" }, "RESTARTED"],
      [{ type: "pauseGame" }, "PAUSED"],
      [{ type: "playGame" }, "RESUMED"],
    ])
  })

  describe("legacy flow", () => {
    test("User starts the game, clicks pause and clicks play again", async function () {
      testStateMachine([
        [{ type: "_startGame" }, "RESUMED"],
        [{ type: "_pauseGame" }, "PAUSED"],
        [{ type: "_resumeGame" }, "RESUMED"],
      ])
    })

    test("User starts the game, clicks restart", async function () {
      testStateMachine([
        [{ type: "_startGame" }, "RESUMED"],
        [{ type: "_startGame" }, "RESTARTED"],
      ])
    })

    test("User starts the game, loses it, and starts to play again", async function () {
      testStateMachine([
        [{ type: "_startGame" }, "RESUMED"],
        ["SDK_GAME_OVER", "GAME_OVER"],
        [{ type: "_startGame" }, "RESTARTED"],
      ])
    })

    test("User starts the game, loses it, starts to play again, pauses, resumes", async function () {
      testStateMachine([
        [{ type: "_startGame" }, "RESUMED"],
        ["SDK_GAME_OVER", "GAME_OVER"],
        [{ type: "_startGame" }, "RESTARTED"],
        [{ type: "_pauseGame" }, "PAUSED"],
        [{ type: "_resumeGame" }, "RESUMED"],
      ])
    })
  })

  describe("error state", () => {
    test("should send error message when init is called multiple times", () => {
      const { Rune } = getRuneSdk(1)

      let error: string | null = null

      runePostMessageHandler((event) => {
        if (event.type === "ERR") {
          error = event.errMsg
        }
      })

      initRune(Rune)
      initRune(Rune)

      expect(error).toEqual("Fatal issue: Received onGameInit while in INIT.PAUSED")
    })

    test("should send error message when game over is without initialization", () => {
      const { Rune } = getRuneSdk(1)

      let error: string | null = null

      runePostMessageHandler((event) => {
        if (event.type === "ERR") {
          error = event.errMsg
        }
      })

      Rune.gameOver()

      expect(error).toEqual("Fatal issue: Received onGameOver while in LOADING")
    })

    test("should go to error state when game over is called during pause", () => {
      const { Rune } = getRuneSdk(1)

      let error: string | null = null

      runePostMessageHandler((event) => {
        if (event.type === "ERR") {
          error = event.errMsg
        }
      })

      initRune(Rune)
      Rune.gameOver()

      expect(error).toEqual("Fatal issue: Received onGameOver while in INIT.PAUSED")
    })

    test("should go to error state when game over is called multiple times in a row", () => {
      const { Rune, stateMachineService } = getRuneSdk(1)

      let error: string | null = null

      runePostMessageHandler((event) => {
        if (event.type === "ERR") {
          error = event.errMsg
        }
      })

      initRune(Rune)
      sendRuneAppCommand(stateMachineService, { type: "playGame" })
      Rune.gameOver()
      Rune.gameOver()

      expect(error).toEqual("Fatal issue: Received onGameOver while in INIT.GAME_OVER")
    })
  })
})
