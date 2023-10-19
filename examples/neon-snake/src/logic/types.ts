import { PlayerId, RuneClient } from "rune-games-sdk"

declare global {
  const Rune: RuneClient<GameState, GameActions>
}

export interface GameState {
  stage: "gettingReady" | "countdown" | "playing" | "endOfRound"
  players: PlayerInfo[]
  snakes: { [playerId: PlayerId]: Snake }
  collisionGrid: { [index: number]: boolean }
  countdownTimer: number
  timerStartedAt: number
  lastRoundWinnerId: PlayerId | undefined
}

export type GameActions = {
  setTurning(turning: Turning): void
  setReady(): void
}

export type Turning = "left" | "right" | "none"

export type State = "pending" | "alive" | "dead"

export type Point = { x: number; y: number }

export type Section = {
  start: Point
  end: Point
  endAngle: number
  gap: boolean
} & (
  | {
      turning: "none"
    }
  | {
      turning: "left" | "right"
      arc: {
        center: Point
        startAngle: number
        endAngle: number
      }
    }
)

export type PlayerInfo = {
  playerId: string
  color: string
  state: State
  score: number
}

export type Snake = {
  gapCounter: number
  turning: "left" | "right" | "none"
  line: Section[]
}
