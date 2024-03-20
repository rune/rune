import { describe, it } from "@jest/globals"

import { buildFixture, createLogger } from "./buildFixture.js"

describe("external dependencies", () => {
  it("basic project", async () => {
    const logger = createLogger()

    await buildFixture("external-basic", logger)

    console.log(logger.warn.mock.calls)
  })
})
