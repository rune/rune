import { remap } from "./remap"

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

function scoreBase(distance: number) {
  return -Math.log2(distance / 10 - 0.1 + 1)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
