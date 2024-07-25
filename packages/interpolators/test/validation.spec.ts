import { validateUpdateParams } from "../src/validation"

describe("validation", () => {
  it("should expect game & futureGame to be defined & correct type", () => {
    // @ts-ignore
    expect(() => validateUpdateParams({}, null)).toThrow(
      "game & futureGame must be defined"
    )

    // @ts-ignore
    expect(() => validateUpdateParams(null, null)).toThrow(
      "game & futureGame must be defined"
    )

    // @ts-ignore
    expect(() => validateUpdateParams({ game: [] }, null)).toThrow(
      "game & futureGame must be defined"
    )

    expect(() =>
      validateUpdateParams({ game: [], futureGame: [] }, null)
    ).toThrow("game & futureGame must not be an empty array")

    expect(() =>
      validateUpdateParams({ game: [1], futureGame: [1, 2] }, null)
    ).toThrow("game and futureGame dimensions must match")

    expect(() =>
      // @ts-ignore
      validateUpdateParams({ game: {}, futureGame: {} }, null)
    ).toThrow("game & futureGame must be either a number or array of numbers")

    expect(() =>
      validateUpdateParams({ game: [1, null], futureGame: [1, 2] }, null)
    ).toThrow("game[1] must be a number")

    expect(() =>
      validateUpdateParams({ game: [1, 3], futureGame: [null, 2] }, null)
    ).toThrow("futureGame[0] must be a number")

    expect(() =>
      validateUpdateParams(
        { game: [1, 3, 4, 5, 2], futureGame: [1, 2, 4, 5, 2] },
        null
      )
    ).toThrow(
      "game & futureGame must be either a number or array of numbers up to 4 dimensions"
    )

    expect(() => validateUpdateParams({ game: 1, futureGame: 3 }, 2)).toThrow(
      "game & futureGame must remain same dimensions in all update calls"
    )

    expect(() =>
      validateUpdateParams({ game: 1, futureGame: 3 }, null)
    ).not.toThrow()
    expect(() =>
      validateUpdateParams({ game: 1, futureGame: 3 }, -1)
    ).not.toThrow()
  })
})
