import { Difficulty } from "sudoku-gen/dist/types/difficulty.type"

export interface Cell {
  value: number | null
  correctValue: number
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
  players: {
    [playerId: string]: {
      color: Color
      selection: Coordinate
    }
  }
}

export interface GameActions {
  startGame: (difficulty: Difficulty) => void
  select: (coordinate: Coordinate) => void
}
