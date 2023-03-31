import { remap } from "./remap"
import { clamp } from "./clamp"

export function calculateScore(dist: number) {
  const min = 0.1
  const max = 20000
  const clampedDist = clamp(dist, min, max)

  return Math.round(
    Math.abs(
      remap(scoreBase(clampedDist), [scoreBase(min), scoreBase(max)], [1000, 0])
    )
  )
}

function scoreBase(distance: number): number {
  return -Math.log2(distance / 10 - 0.1 + 1)
}
