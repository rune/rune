import { Panorama } from "./Panorama"
import { Coordinate } from "ol/coordinate"

export interface GameState {
  sessionId: number
  playerIds: string[]
  rounds: { panorama: Panorama }[]
  currentRound: number
  guesses: {
    playerId: string
    round: number
    location: Coordinate
    distance: number
    score: number
  }[]
}
