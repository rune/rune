import { Cell } from "./types/GameState"
import { range } from "./range"
import { doesCellHaveDuplicates } from "./doesCellHaveDuplicates"

export function calculateValidValues(board: Cell[]) {
  for (const cell of board) {
    if (cell.value) {
      cell.validValues = []
    } else {
      const currentValue = cell.value

      cell.validValues = []

      range(1, 10).forEach((note) => {
        cell.value = note
        if (!doesCellHaveDuplicates(board, cell)) cell.validValues.push(note)
      })

      cell.value = currentValue
    }
  }
}
