import { PlayerId } from "rune-games-sdk"

export type Turning = "left" | "right" | "none"

export type Point = {
  x: number
  y: number
}

export type Section = {
  start: Point
  end: Point
  endAngle: number
  gap: boolean
} & (
  | { turning: "none" }
  | {
      turning: "left" | "right"
      arcCenter: Point
      arcStartAngle: number
      arcEndAngle: number
    }
)

export type PlayerInfo = {
  playerId: string
  turning: Turning
  gapCounter: number
  color: string
  state: "pending" | "alive" | "dead"
  line: Section[]
  score: number
}

export interface GameState {
  stage: "gettingReady" | "countdown" | "playing" | "endOfRound"
  players: PlayerInfo[]
  collisionGrid: boolean[]
  readyPlayerIds: PlayerId[]
  timer: number
  timerStartedAt: number
  lastRoundWinnerId: PlayerId | undefined
}

export type GameActions = {
  setTurning(turning: Turning): void
  setReady(): void
}
