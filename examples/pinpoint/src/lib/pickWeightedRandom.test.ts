import { describe, test, expect } from "@jest/globals"
import { Arr, pickWeightedRandom } from "./pickWeightedRandom"

describe("pickWeightedRandom", () => {
  test("returns random panorama", async () => {
    const panoramas: Arr[] = [
      [0, 0, 1],
      [1, 1, 2],
      [1, 1, 3],
    ]
    const randomPanorama = pickWeightedRandom(panoramas)

    expect(panoramas.includes(randomPanorama)).toBe(true)
  })
})
