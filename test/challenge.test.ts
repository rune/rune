import { getRuneSdk } from "../src"
import { getUrlParams } from "../src/internal/getUrlParams"

describe("Game Challenge", () => {
  test("should use url params to set challenge number", () => {
    jest.spyOn(URLSearchParams.prototype, "get").mockImplementation(() => "10")
    const { challengeNumber } = getUrlParams()

    const { Rune } = getRuneSdk({ challengeNumber })

    expect(Rune.getChallengeNumber()).toEqual(10)
  })

  test("should default to 1 in case the challenge number is not valid", () => {
    jest
      .spyOn(URLSearchParams.prototype, "get")
      .mockImplementation(() => "badData")
    const { challengeNumber } = getUrlParams()

    const { Rune } = getRuneSdk({ challengeNumber })

    expect(Rune.getChallengeNumber()).toEqual(1)
  })
})
