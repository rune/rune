import { describe, test, expect } from "@jest/globals"

import { apiErrorCode, apiErrorMessage } from "./apiErrorMessage"

const apolloError = (message: string) =>
  Object.assign(new Error(message), {
    graphQLErrors: [{ message }],
    networkError: null,
  })

describe("apiErrorMessage", () => {
  test("shows the server's message for a refusal with a code", () => {
    expect(
      apiErrorMessage(
        apolloError(
          "[tango][CHECKPOINT_MOVED] The game changed since your last pull or upload. Run `rune pull`, then upload again."
        )
      )
    ).toBe(
      "The game changed since your last pull or upload. Run `rune pull`, then upload again."
    )
    expect(
      apiErrorMessage(
        apolloError(
          "[tango][UPLOAD_INVALID] The game's files can't be uploaded:\n/logic.js is missing from the zip's root"
        )
      )
    ).toBe(
      "The game's files can't be uploaded:\n/logic.js is missing from the zip's root"
    )
  })

  test("falls back to the CLI's messages for a bare code", () => {
    expect(apiErrorMessage(apolloError("[tango][GAME_NOT_FOUND]"))).toBe(
      "Game not found, or you're not one of its developers."
    )
    expect(apiErrorMessage(apolloError("[tango][UNEXPECTED_ERR]"))).toMatch(
      /^Something went wrong/
    )
  })

  test("shows a local error's message", () => {
    expect(apiErrorMessage(new Error("Run `rune pull` first."))).toBe(
      "Run `rune pull` first."
    )
  })
})

describe("apiErrorCode", () => {
  test("reads the code of a refusal", () => {
    expect(
      apiErrorCode(apolloError("[tango][CHECKPOINT_MOVED] The game changed."))
    ).toBe("CHECKPOINT_MOVED")
    expect(apiErrorCode(apolloError("[tango][GAME_NOT_FOUND]"))).toBe(
      "GAME_NOT_FOUND"
    )
    expect(apiErrorCode(new Error("local"))).toBeUndefined()
  })
})
