import { GameState } from "./types/GameState"
import { findDuplicates } from "./findDuplicates"
import { highlightDuplicates } from "./highlightDuplicates"
import { isBoardFilled } from "./isBoardFilled"
import { GameOverOptions } from "rune-games-sdk/multiplayer"

export function calculateErrorsOrGameOver(game: GameState) {
  if (!game.sudoku) throw Rune.invalidAction()

  const duplicates = findDuplicates(game.sudoku.board)
  highlightDuplicates(game.sudoku.board, duplicates)

  if (isBoardFilled(game.sudoku.board) && duplicates.length === 0) {
    game.gameOver = true
    Rune.gameOver({
      everyone: "WON",
      delayPopUp: true,
    })
  }
}
