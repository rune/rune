import { Coordinate } from "ol/coordinate"

export interface GameActions {
  makeGuess: (location: Coordinate) => void
  nextRound: () => void
}
