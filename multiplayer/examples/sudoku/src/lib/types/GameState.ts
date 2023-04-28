import { Difficulty } from "sudoku-gen/dist/types/difficulty.type"

export interface Cell {
  value: number | null
  valueLock: number
  fixed: boolean
  correctValue: number
  error: boolean
  lastModifiedByPlayerId: string | null
  notes: number[]
}

export interface Coordinate {
  row: number
  col: number
}

export type Color = [number, number, number]

export interface GameState {
  session: string
  onboardingBoard: Cell[]
  gameOver: boolean
  sudoku: {
    difficulty: Difficulty
    board: Cell[]
  } | null
  playerState: {
    [playerId: string]: {
      color: Color
      selection: Coordinate
    }
  }
  hints: Coordinate[]
  successes: ({ row: number } | { col: number } | { section: number })[]
}
