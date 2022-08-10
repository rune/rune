import {
  initRune,
  runePostMessageHandler,
  sendRuneAppCommand,
  simulateNativeApp,
} from "./helper"
import { getRuneSdk } from "../src"
import { RuneAppCommand } from "../src/types"

type ExpectedCallbacks =
  | null
  | "resumeGame"
  | "pauseGame"
  | "restartGame"
  | "gameOverMessage"

// Helper function which for each app command (or sdk game over) expects a callback to be called
function testStateMachineCallbacks(
  steps: [RuneAppCommand | "SDK_GAME_OVER", ExpectedCallbacks][]
) {
  const { Rune, stateMachineService } = getRuneSdk({ challengeNumber: 1 })

  let latestCallback: ExpectedCallbacks = null
  initRune(Rune, {
    pauseGame: () => {
      latestCallback = "pauseGame"
    },
    resumeGame: () => {
      latestCallback = "resumeGame"
    },
    restartGame: () => {
      latestCallback = "restartGame"
    },
  })

  // Listen for game over command, if it happens, set the latest callback to gameOverMessage
  runePostMessageHandler((event) => {
    if (event.type === "GAME_OVER") {
      latestCallback = "gameOverMessage"
    }
  })

  // Should be no change in gameState from calling init()
  expect(latestCallback).toBe(null)

  steps.forEach(([command, expectedCallback]) => {
    if (command === "SDK_GAME_OVER") {
      Rune.gameOver()
    } else {
      sendRuneAppCommand(stateMachineService, command)
    }

    expect(latestCallback).toBe(expectedCallback)
  })
}

beforeEach(async () => {
  simulateNativeApp()
})

describe("stateMachine", function () {
  test("User starts the game, clicks pause and clicks play again", async function () {
    testStateMachineCallbacks([
      [{ type: "playGame", gamePlayUuid: "1" }, "resumeGame"],
      [{ type: "pauseGame" }, "pauseGame"],
      [{ type: "playGame", gamePlayUuid: "2" }, "resumeGame"],
    ])
  })

  test("User starts the game, clicks restart", async function () {
    testStateMachineCallbacks([
      [{ type: "playGame", gamePlayUuid: "1" }, "resumeGame"],
      [{ type: "restartGame", gamePlayUuid: "2" }, "restartGame"],
    ])
  })

  test("User starts the game, loses it, and starts to play again", async function () {
    testStateMachineCallbacks([
      [{ type: "playGame", gamePlayUuid: "1" }, "resumeGame"],
      ["SDK_GAME_OVER", "gameOverMessage"],
      [{ type: "playGame", gamePlayUuid: "2" }, "restartGame"],
    ])
  })

  test("User starts the game, loses it, starts to play again, pauses, resumes", async function () {
    testStateMachineCallbacks([
      [{ type: "playGame", gamePlayUuid: "1" }, "resumeGame"],
      ["SDK_GAME_OVER", "gameOverMessage"],
      [{ type: "playGame", gamePlayUuid: "2" }, "restartGame"],
      [{ type: "pauseGame" }, "pauseGame"],
      [{ type: "playGame", gamePlayUuid: "3" }, "resumeGame"],
    ])
  })
})
