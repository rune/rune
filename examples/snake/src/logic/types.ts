import { PlayerId, RuneClient } from "rune-games-sdk"

declare global {
  const Rune: RuneClient<GameState, GameActions>
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

export type Turning = "left" | "right" | "none"

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
      // TODO: nest under arc object when SDK is updated
      arcCenter: Point
      arcStartAngle: number
      arcEndAngle: number
    }
)

export type PlayerInfo = {
  playerId: string
  turning: "left" | "right" | "none"
  gapCounter: number
  color: string
  state: "pending" | "alive" | "dead"
  line: Section[]
  score: number
}
