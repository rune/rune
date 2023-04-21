import { Difficulty } from "sudoku-gen/dist/types/difficulty.type"

export interface Cell {
  value: number | null
  valueLock: number
  fixed: boolean
  correctValue: number
  error: boolean
}

export interface Coordinate {
  row: number
  col: number
}

export type Color = [number, number, number]

export interface GameState {
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
}
