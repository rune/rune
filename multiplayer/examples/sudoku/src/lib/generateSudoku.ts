import { getSudoku } from "sudoku-gen"
import { Difficulty } from "sudoku-gen/dist/types/difficulty.type"
import { Cell } from "./types/GameState"
import { getRandomItem } from "./getRandomItem"

export function generateSudoku({
  difficulty,
  solved,
}: {
  difficulty: Difficulty
  solved: boolean
}): Cell[] {
  const sudoku = getSudoku(adjustLevel(difficulty))

  const board = sudoku.puzzle.split("").map((value, index) => ({
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
    validValues: [],
  }))

  if (difficulty === "easy") addMoreFixedCells(board, 16)

  return board
}

function adjustLevel(difficulty: Difficulty): Difficulty {
  return difficulty === "easy" || difficulty === "medium"
    ? "easy"
    : difficulty === "hard"
    ? "medium"
    : Math.random() > 0.5
    ? "hard"
    : "expert"
}

function addMoreFixedCells(board: Cell[], cellsToAdd: number) {
  for (let i = 0; i < cellsToAdd; i++) {
    const nonFixedCell = getRandomItem(board.filter((cell) => !cell.fixed))

    if (nonFixedCell) {
      nonFixedCell.value = nonFixedCell.correctValue
      nonFixedCell.fixed = true
    }
  }
}
