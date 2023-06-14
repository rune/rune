import { Coordinate } from "ol/coordinate"

export function calculateDistance(from: Coordinate, to: Coordinate) {
  const a = from[0] - to[0]
  const b = from[1] - to[1]

  return Math.sqrt(a * a + b * b)
}
