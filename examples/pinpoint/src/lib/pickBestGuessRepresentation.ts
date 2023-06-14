import { Coordinate } from "ol/coordinate"
import { calculateDistance } from "./calculateDistance"
import { minBy } from "./minBy"

export function pickBestGuessRepresentation(
  target: Coordinate,
  guess: Coordinate
) {
  const options = [
    [guess[0], guess[1]],
    [guess[0] - 360, guess[1]],
    [guess[0] + 360, guess[1]],
  ].map((option) => ({
    option,
    distance: calculateDistance(target, option),
  }))

  return minBy(options, (option) => option.distance)?.option ?? guess
}
