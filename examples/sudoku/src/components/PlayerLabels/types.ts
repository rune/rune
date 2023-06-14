import { Color } from "../../lib/types/GameState"

export type Rect = {
  x: number
  y: number
  width: number
  height: number
}

export type Direction = "left" | "right"

export type LabelDefinition = {
  playerId: string
  color: Color
  cellRect: Rect
  width: number
  height: number
  position: { x: number; y: number }
  direction: Direction
}

export type LabelMap = { [playerId: string]: LabelDefinition }
