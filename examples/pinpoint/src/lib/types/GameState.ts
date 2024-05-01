import { Coordinate } from "ol/coordinate"

export interface GameState {
  sessionId: number
  playerIds: string[]
  rounds: { index: number; coords: Coordinate }[]
  currentRound: number
  roundTimerStartedAt: number | null
  guesses: {
    playerId: string
    round: number
    location: Coordinate
    distance: number
    score: number
    missed?: boolean
  }[]
}

export type Persisted = {
  numberOfSessions: number
}
