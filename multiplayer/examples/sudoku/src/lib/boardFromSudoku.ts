import { Sudoku } from "sudoku-gen/dist/types/sudoku.type"

export function boardFromSudoku({
  sudoku,
  solved,
}: {
  sudoku: Sudoku
  solved: boolean
}) {
  return sudoku.puzzle.split("").map((value, index) => ({
    value: solved
      ? parseInt(sudoku.solution[index])
      : value === "-"
      ? null
      : parseInt(value),
    valueLock: Math.random(),
    fixed: value !== "-",
    correctValue: parseInt(sudoku.solution[index]),
    error: false,
    lastModifiedByPlayerId: null,
    notes: [],
  }))
}
