import { Cell } from "./types/GameState"
import type { findDuplicates } from "./findDuplicates"
import { cellPointer } from "./cellPointer"

export function highlightDuplicates(
  board: Cell[],
  duplicates: ReturnType<typeof findDuplicates>
) {
  board.forEach((cell, index) => {
    const { row, col } = cellPointer(index)
    cell.error = duplicates.some(
      (duplicate) =>
        ("row" in duplicate &&
          duplicate.row === row &&
          duplicate.value === cell.value) ||
        ("col" in duplicate &&
          duplicate.col === col &&
          duplicate.value === cell.value) ||
        ("sector" in duplicate &&
          duplicate.sector === Math.floor(row / 3) * 3 + Math.floor(col / 3) &&
          duplicate.value === cell.value)
    )
  })
}
