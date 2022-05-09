import { RuneExport, getRuneSdk } from "../src"
import { initRune, simulateNativeApp } from "./helper"
import { setChallengeNumber } from "../src/internal/setChallengeNumber"

let Rune: RuneExport

beforeEach(async () => {
  delete globalThis.postRuneEvent
  delete globalThis._runeChallengeNumber
  simulateNativeApp()
  Rune = getRuneSdk()
})

describe("Game Challenge", () => {
  test("should use url params to set challenge number", () => {
    globalThis.postRuneEvent = jest.fn()

    setChallengeNumber(Rune, 10)

    initRune(Rune)

    Rune.gameOver()

    expect(globalThis.postRuneEvent).toHaveBeenCalledWith({
      type: "GAME_OVER",
      challengeNumber: 10,
      score: 0,
    })
  })

  test("should default to 1 in case the challenge number is not valid", () => {
    globalThis.postRuneEvent = jest.fn()

    setChallengeNumber(Rune, NaN)

    initRune(Rune)

    Rune.gameOver()

    expect(globalThis.postRuneEvent).toHaveBeenCalledWith({
      type: "GAME_OVER",
      challengeNumber: 1,
      score: 0,
    })
  })

  describe("Legacy flow", () => {
    test("should always try to use window._runeChallengeNumber", () => {
      globalThis.postRuneEvent = jest.fn()

      setChallengeNumber(Rune, 10)

      globalThis._runeChallengeNumber = 20

      initRune(Rune)

      Rune.gameOver()

      expect(globalThis.postRuneEvent).toHaveBeenCalledWith({
        type: "GAME_OVER",
        challengeNumber: 20,
        score: 0,
      })
    })
  })
})
