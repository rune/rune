import { Cell } from "./types/GameState"
import { doesCellHaveDuplicates } from "./doesCellHaveDuplicates"

export function calculateValidValues(board: Cell[]) {
  for (const cell of board) {
    if (cell.value) {
      cell.validValues = []
    } else {
      const currentValue = cell.value

      cell.validValues = []

      for (let note = 1; note <= 9; note++) {
        cell.value = note
        if (!doesCellHaveDuplicates(board, cell)) cell.validValues.push(note)
      }

      cell.value = currentValue
    }
  }
}
