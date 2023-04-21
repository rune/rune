import { Cell } from "./types/GameState"

export function isBoardFilled(board: Cell[]) {
  return board.every((cell) => cell.value !== null)
}
