import { getRuneSdk } from "../src/sdk"
import { initRune, sendRuneAppCommand, simulateNativeApp } from "./helper"
import { hashFromString } from "../src/internal/rng"

beforeEach(async () => {
  simulateNativeApp()
})

const CHALLENGE_NUMBER = 123
describe("rng", () => {
  test("deterministicRandom() works before init()", async function () {
    const { Rune } = getRuneSdk(1)
    const randomArray = [...Array(7)].map(() =>
      Math.round(Rune.deterministicRandom() * 10)
    )
    expect(randomArray).toEqual([1, 4, 4, 3, 5, 1, 7])
  })

  test("deterministicRandom() changes value based on challengeNumber", async function () {
    const { Rune } = getRuneSdk(CHALLENGE_NUMBER)

    const randomArray = [...Array(7)].map(() =>
      Math.round(Rune.deterministicRandom() * 10)
    )
    expect(randomArray).toEqual([2, 4, 5, 3, 6, 9, 6])
  })

  test("deterministicRandom() does not reset at game start", async function () {
    const { Rune, stateMachineService } = getRuneSdk(1)

    const randomArray1 = [...Array(7)].map(() =>
      Math.round(Rune.deterministicRandom() * 10)
    )

    initRune(Rune)

    sendRuneAppCommand(stateMachineService, { type: "playGame" })

    const randomArray2 = [...Array(7)].map(() =>
      Math.round(Rune.deterministicRandom() * 10)
    )
    expect(randomArray1).not.toEqual(randomArray2)
  })

  test("deterministicRandom() is reset after game is over and started again", async function () {
    const { Rune, stateMachineService } = getRuneSdk(1)

    const randomArray1 = [...Array(7)].map(() =>
      Math.round(Rune.deterministicRandom() * 10)
    )

    initRune(Rune)
    sendRuneAppCommand(stateMachineService, { type: "playGame" })
    Rune.gameOver()
    sendRuneAppCommand(stateMachineService, { type: "playGame" })

    // See that random numbers are identical
    const randomArray2 = [...Array(7)].map(() =>
      Math.round(Rune.deterministicRandom() * 10)
    )
    expect(randomArray1).toEqual(randomArray2)
  })

  test("deterministicRandom() is reset at game restart", async function () {
    const { Rune, stateMachineService } = getRuneSdk(1)

    const randomArray1 = [...Array(7)].map(() =>
      Math.round(Rune.deterministicRandom() * 10)
    )

    initRune(Rune)

    sendRuneAppCommand(stateMachineService, { type: "playGame" })
    sendRuneAppCommand(stateMachineService, { type: "restartGame" })

    const randomArray2 = [...Array(7)].map(() =>
      Math.round(Rune.deterministicRandom() * 10)
    )
    expect(randomArray1).toEqual(randomArray2)
  })
  test("deterministicRandom() seed changes dramatically with every challenge number", async function () {
    // This is important to prevent correlation etc. between challenges
    expect(hashFromString("1")).toMatchInlineSnapshot("1986881138")
    expect(hashFromString("2")).toMatchInlineSnapshot("2072285185")
  })
})
