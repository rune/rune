import { Coordinate } from "ol/coordinate"

export interface GameState {
  sessionId: number
  playerIds: string[]
  rounds: { index: number; coords: { lon: number; lat: number } }[]
  currentRound: number
  guesses: {
    playerId: string
    round: number
    location: Coordinate
    distance: number
    score: number
  }[]
}
