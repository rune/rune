import { describe, test, expect } from "@jest/globals"
import {
  Panorama,
  generateWeightedPanoramas,
} from "./generateWeightedPanoramas"

describe("generateWeightedPanoramas", () => {
  test("generateWeightedPanoramas", async () => {
    const panoramas: Panorama[] = [
      [0, 0, 1],
      [1, 1, 2],
      [1, 1, 3],
    ]
    const weightedPanoramas = generateWeightedPanoramas(panoramas)

    expect(weightedPanoramas).toEqual([
      panoramas[0],
      panoramas[1],
      panoramas[1],
      panoramas[2],
      panoramas[2],
      panoramas[2],
    ])
  })
})
