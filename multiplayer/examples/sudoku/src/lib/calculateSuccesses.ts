import { GameState, Coordinate } from "./types/GameState"
import { cellPointer } from "./cellPointer"
import { range } from "./range"

export function calculateSuccesses(game: GameState, cellCoords: Coordinate) {
  function isCellFilledAndNoError(pointer: Coordinate) {
    const cell = game.sudoku?.board.at(cellPointer(pointer))
    return cell && cell.value && !cell.error
  }

  if (
    range(9).every((row) =>
      isCellFilledAndNoError({ row, col: cellCoords.col })
    )
  ) {
    game.successes.push({ col: cellCoords.col })
  }

  if (
    range(9).every((col) =>
      isCellFilledAndNoError({ row: cellCoords.row, col })
    )
  ) {
    game.successes.push({ row: cellCoords.row })
  }

  const section =
    Math.floor(cellCoords.row / 3) * 3 + Math.floor(cellCoords.col / 3)

  if (
    range(9).every((index) =>
      isCellFilledAndNoError({
        row: Math.floor(section / 3) * 3 + Math.floor(index / 3),
        col: (section % 3) * 3 + (index % 3),
      })
    )
  ) {
    game.successes.push({ section })
  }
}
