import { Coordinate } from "ol/coordinate"

export type GameActions = {
  makeGuess: (location: Coordinate) => void
  nextRound: () => void
}
