import { Sudoku } from "sudoku-gen/dist/types/sudoku.type"

export function boardFromSudoku(sudoku: Sudoku) {
  return sudoku.puzzle.split("").map((value, index) => ({
    value: value === "-" ? null : parseInt(value),
    // TODO: remove, used for testing game over
    // value: parseInt(sudoku.solution[index]),
    valueLock: Math.random(),
    fixed: value !== "-",
    correctValue: parseInt(sudoku.solution[index]),
    error: false,
    lastModifiedByPlayerId: null,
    // TODO: remove, used for testing game over
    // lastModifiedByPlayerId:
    //   value !== "-"
    //     ? null
    //     : Object.keys(game.playerState).sort()[
    //         Math.floor(
    //           Math.random() * Object.keys(game.playerState).length
    //         )
    //       ],
    notes: [],
  }))
}
