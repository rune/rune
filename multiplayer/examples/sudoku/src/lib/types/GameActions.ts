import { Difficulty } from "sudoku-gen/dist/types/difficulty.type"
import { Coordinate } from "./GameState"

export type GameActions = {
  startGame: (difficulty: Difficulty) => void
  select: (coordinate: Coordinate) => void
  setValue: (args: { value: number | null; clientValueLock: number }) => void
  showHint: () => void
  toggleNote: (arg: { value: number | null }) => void
}
