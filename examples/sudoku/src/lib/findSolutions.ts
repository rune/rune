import { Cell } from "./types/GameState"
import { doesCellHaveDuplicates } from "./doesCellHaveDuplicates"

export function findSolutions(board: Cell[]) {
  const cellsToFill = board.filter((cell) => !cell.fixed)
  const solutions: number[][] = []

  solveCell(board, cellsToFill, 0, solutions)

  return solutions
}

function solveCell(
  board: Cell[],
  cellsToFill: Cell[],
  cellIdx: number,
  solutions: number[][]
): boolean {
  const cell = cellsToFill[cellIdx]

  if (!cell) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    solutions.push(board.map((cell) => cell.value!))
    return false
  }

  for (const value of cell.validValues) {
    cell.value = value

    if (doesCellHaveDuplicates(board, cell)) continue

    if (!solveCell(board, cellsToFill, cellIdx + 1, solutions)) continue

    return true
  }

  cell.value = null

  return false
}
