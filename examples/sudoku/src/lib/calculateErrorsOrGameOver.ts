import { GameState, Persisted } from "./types/GameState"
import { findDuplicates } from "./findDuplicates"
import { highlightDuplicates } from "./highlightDuplicates"
import { isBoardFilled } from "./isBoardFilled"
import { GameStateWithPersisted } from "rune-sdk"

export function calculateErrorsOrGameOver(
  game: GameStateWithPersisted<GameState, Persisted>
) {
  if (!game.sudoku) throw Rune.invalidAction()

  const duplicates = findDuplicates(game.sudoku.board)
  highlightDuplicates(game.sudoku.board, duplicates)

  if (isBoardFilled(game.sudoku.board) && duplicates.length === 0) {
    game.gameOver = true

    Object.keys(game.playerState).forEach((playerId) => {
      game.persisted[playerId] = {
        numberOfFinishedGames:
          (game.persisted[playerId].numberOfFinishedGames || 0) + 1,
      }
    })

    Rune.gameOver({
      everyone: "WON",
      delayPopUp: true,
    })
  }
}
