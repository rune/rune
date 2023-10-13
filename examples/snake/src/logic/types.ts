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
  state: "alive" | "dead"
  line: Section[]
}
