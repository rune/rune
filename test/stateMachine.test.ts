import {
  initRune,
  runePostMessageHandler,
  sendRuneAppCommand,
  simulateNativeApp,
} from "./helper"
import { getRuneSdk } from "../src"
import { LegacyRuneGameCommand, RuneAppCommand } from "../src/types"

type ExpectedCallbacks =
  | null
  | "resumeGame"
  | "pauseGame"
  | "restartGame"
  | "gameOverMessage"
  | "startGame" // legacy

// Helper function which for each app command (or sdk game over) expects a callback to be called
function testStateMachineCallbacks(
  steps: [
    RuneAppCommand | LegacyRuneGameCommand | "SDK_GAME_OVER",
    ExpectedCallbacks
  ][],
  useStart = false
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
    ...(useStart
      ? {
          startGame: () => {
            latestCallback = "startGame"
          },
        }
      : {
          restartGame: () => {
            latestCallback = "restartGame"
          },
        }),
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
      [{ type: "playGame", gamePlayUuid: '1' }, "resumeGame"],
      [{ type: "pauseGame" }, "pauseGame"],
      [{ type: "playGame", gamePlayUuid: '2' }, "resumeGame"],
    ])
  })

  test("User starts the game, clicks restart", async function () {
    testStateMachineCallbacks([
      [{ type: "playGame", gamePlayUuid: '1' }, "resumeGame"],
      [{ type: "restartGame", gamePlayUuid: '2' }, "restartGame"],
    ])
  })

  test("User starts the game, loses it, and starts to play again", async function () {
    testStateMachineCallbacks([
      [{ type: "playGame", gamePlayUuid: '1' }, "resumeGame"],
      ["SDK_GAME_OVER", "gameOverMessage"],
      [{ type: "playGame", gamePlayUuid: '2' }, "restartGame"],
    ])
  })

  test("User starts the game, loses it, starts to play again, pauses, resumes", async function () {
    testStateMachineCallbacks([
      [{ type: "playGame", gamePlayUuid: '1' }, "resumeGame"],
      ["SDK_GAME_OVER", "gameOverMessage"],
      [{ type: "playGame", gamePlayUuid: '2' }, "restartGame"],
      [{ type: "pauseGame" }, "pauseGame"],
      [{ type: "playGame", gamePlayUuid: '3' }, "resumeGame"],
    ])
  })

  describe("legacy client", () => {
    test("User starts the game, clicks pause and clicks play again", async function () {
      testStateMachineCallbacks([
        [{ type: "_startGame" }, "resumeGame"],
        [{ type: "_pauseGame" }, "pauseGame"],
        [{ type: "_resumeGame" }, "resumeGame"],
      ])
    })

    test("User starts the game, clicks restart", async function () {
      testStateMachineCallbacks([
        [{ type: "_startGame" }, "resumeGame"],
        [{ type: "_startGame" }, "restartGame"],
      ])
    })

    test("User starts the game, loses it, and starts to play again", async function () {
      testStateMachineCallbacks([
        [{ type: "_startGame" }, "resumeGame"],
        ["SDK_GAME_OVER", "gameOverMessage"],
        [{ type: "_startGame" }, "restartGame"],
      ])
    })

    test("User starts the game, loses it, starts to play again, pauses, resumes", async function () {
      testStateMachineCallbacks([
        [{ type: "_startGame" }, "resumeGame"],
        ["SDK_GAME_OVER", "gameOverMessage"],
        [{ type: "_startGame" }, "restartGame"],
        [{ type: "_pauseGame" }, "pauseGame"],
        [{ type: "_resumeGame" }, "resumeGame"],
      ])
    })
  })

  describe("legacy game, legacy client", () => {
    test("User starts the game, clicks pause and clicks play again", async function () {
      testStateMachineCallbacks(
        [
          [{ type: "_startGame" }, "startGame"],
          [{ type: "_pauseGame" }, "pauseGame"],
          [{ type: "_resumeGame" }, "resumeGame"],
        ],
        true
      )
    })

    test("User starts the game, clicks restart", async function () {
      testStateMachineCallbacks(
        [
          [{ type: "_startGame" }, "startGame"],
          [{ type: "_startGame" }, "startGame"],
        ],
        true
      )
    })

    test("User starts the game, loses it, and starts to play again", async function () {
      testStateMachineCallbacks(
        [
          [{ type: "_startGame" }, "startGame"],
          ["SDK_GAME_OVER", "gameOverMessage"],
          [{ type: "_startGame" }, "startGame"],
        ],
        true
      )
    })

    test("User starts the game, loses it, starts to play again, pauses, resumes", async function () {
      testStateMachineCallbacks(
        [
          [{ type: "_startGame" }, "startGame"],
          ["SDK_GAME_OVER", "gameOverMessage"],
          [{ type: "_startGame" }, "startGame"],
          [{ type: "_pauseGame" }, "pauseGame"],
          [{ type: "_resumeGame" }, "resumeGame"],
        ],
        true
      )
    })
  })

  describe("legacy game, new client", () => {
    test("User starts the game, clicks pause and clicks play again", async function () {
      testStateMachineCallbacks(
        [
          [{ type: "playGame", gamePlayUuid: '1' }, "startGame"],
          [{ type: "pauseGame" }, "pauseGame"],
          [{ type: "playGame", gamePlayUuid: '2' }, "resumeGame"],
        ],
        true
      )
    })

    test("User starts the game, clicks restart", async function () {
      testStateMachineCallbacks(
        [
          [{ type: "playGame", gamePlayUuid: '1' }, "startGame"],
          [{ type: "restartGame", gamePlayUuid: '2' }, "startGame"],
        ],
        true
      )
    })

    test("User starts the game, loses it, and starts to play again", async function () {
      testStateMachineCallbacks(
        [
          [{ type: "playGame", gamePlayUuid: '1' }, "startGame"],
          ["SDK_GAME_OVER", "gameOverMessage"],
          [{ type: "playGame", gamePlayUuid: '2' }, "startGame"],
        ],
        true
      )
    })

    test("User starts the game, loses it, starts to play again, pauses, resumes", async function () {
      testStateMachineCallbacks(
        [
          [{ type: "playGame", gamePlayUuid: '1' }, "startGame"],
          ["SDK_GAME_OVER", "gameOverMessage"],
          [{ type: "playGame", gamePlayUuid: '2' }, "startGame"],
          [{ type: "pauseGame" }, "pauseGame"],
          [{ type: "playGame", gamePlayUuid: '3' }, "resumeGame"],
        ],
        true
      )
    })
  })
})
