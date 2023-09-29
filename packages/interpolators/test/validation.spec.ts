/* eslint-disable @typescript-eslint/ban-ts-comment */

import { validateUpdateParams } from "../src/validation"

describe("validation", () => {
  it("should expect current & future to be defined & correct type", () => {
    // @ts-ignore
    expect(() => validateUpdateParams({}, null)).toThrow(
      "current & future must be defined"
    )

    // @ts-ignore
    expect(() => validateUpdateParams(null, null)).toThrow(
      "current & future must be defined"
    )

    // @ts-ignore
    expect(() => validateUpdateParams({ current: [] }, null)).toThrow(
      "current & future must be defined"
    )

    expect(() =>
      validateUpdateParams({ current: [], future: [] }, null)
    ).toThrow("current & future must not be an empty array")

    expect(() =>
      // @ts-ignore
      validateUpdateParams({ current: 1, future: [] }, null)
    ).toThrow("current and future dimensions must match")

    expect(() =>
      validateUpdateParams({ current: [1], future: [1, 2] }, null)
    ).toThrow("current and future dimensions must match")

    expect(() =>
      validateUpdateParams({ current: [1, null], future: [1, 2] }, null)
    ).toThrow("current[1] must be a number")

    expect(() =>
      validateUpdateParams({ current: [1, 3], future: [null, 2] }, null)
    ).toThrow("future[0] must be a number")

    expect(() =>
      validateUpdateParams(
        { current: [1, 3, 4, 5, 2], future: [1, 2, 4, 5, 2] },
        null
      )
    ).toThrow(
      "current & future must be either a number or array of numbers up to 4 dimensions"
    )

    expect(() => validateUpdateParams({ current: 1, future: 3 }, 2)).toThrow(
      "current & future must remain same dimensions in all update calls"
    )

    expect(() =>
      validateUpdateParams({ current: 1, future: 3 }, null)
    ).not.toThrow()
    expect(() =>
      validateUpdateParams({ current: 1, future: 3 }, -1)
    ).not.toThrow()
  })
})
