import { Cell } from "./types/GameState"
import { cellPointer } from "./cellPointer"

export function doesCellHaveDuplicates(board: Cell[], cell: Cell) {
  const { row, col } = cellPointer(board.indexOf(cell))

  for (let i = 0; i < 9; i++) {
    const sameRowCell = board[cellPointer({ row, col: i })]
    const sameColCell = board[cellPointer({ row: i, col })]
    const sameSectorCell =
      board[
        cellPointer({
          row: Math.floor(row / 3) * 3 + Math.floor(i / 3),
          col: Math.floor(col / 3) * 3 + (i % 3),
        })
      ]

    if (
      (cell !== sameRowCell && cell.value === sameRowCell.value) ||
      (cell !== sameColCell && cell.value === sameColCell.value) ||
      (cell !== sameSectorCell && cell.value === sameSectorCell.value)
    )
      return true
  }

  return false
}
