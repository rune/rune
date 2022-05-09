import { RuneExport, getRuneSdk } from "../src"
import { setChallengeNumber } from "../src/internal/setChallengeNumber"

let Rune: RuneExport

beforeEach(async () => {
  delete globalThis._runeChallengeNumber
  Rune = getRuneSdk()
})

describe("Game Challenge", () => {
  test("should use url params to set challenge number", () => {
    setChallengeNumber(Rune, 10)

    expect(Rune.getChallengeNumber()).toEqual(10)
  })

  test("should default to 1 in case the challenge number is not valid", () => {
    setChallengeNumber(Rune, NaN)

    expect(Rune.getChallengeNumber()).toEqual(1)
  })

  test("should default to 1 if setup is not done yet", async function () {
    const challengeNumber = Rune.getChallengeNumber()

    expect(challengeNumber).toEqual(1)
  })

  describe("Legacy flow", () => {
    test("should always try to use window._runeChallengeNumber", () => {
      setChallengeNumber(Rune, 10)

      expect(Rune.getChallengeNumber()).toEqual(10)

      globalThis._runeChallengeNumber = 20

      expect(Rune.getChallengeNumber()).toEqual(20)
    })
  })
})
