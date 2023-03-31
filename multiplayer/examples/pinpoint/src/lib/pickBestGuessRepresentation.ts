import { Coordinate } from "ol/coordinate"
import minBy from "lodash/minBy"
import { calculateDistance } from "./calculateDistance"

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
