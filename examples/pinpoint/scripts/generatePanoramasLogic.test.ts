import { describe, test, expect } from "@jest/globals"
import { getBucketId } from "./generatePanoramasLogic"

describe("generatePanoramasLogic", () => {
  test("getBucketId", async () => {
    const min = -180
    const max = 180
    const numberOfCells = 4
    const options = { min, max, numberOfCells }

    // Check min
    expect(getBucketId(-180, options)).toBe(0)

    // Check max
    expect(getBucketId(180, options)).toBe(0)

    // Check edge
    expect(getBucketId(-0.01, options)).toBe(1)
    expect(getBucketId(0, options)).toBe(2)
    expect(getBucketId(+0.01, options)).toBe(2)
  })
})
