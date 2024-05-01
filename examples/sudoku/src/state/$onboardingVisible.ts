import { atom } from "jotai"
import { $gameOver, $game } from "./$game"

const $shouldOnboardingBeVisible = atom(true)

export const $onboardingVisible = atom(
  (get) => {
    const game = get($game)

    if (!game || !game.yourPlayerId) return false

    const numberOfFinishedGames =
      game.game.persisted[game.yourPlayerId].numberOfFinishedGames || 0

    return (
      get($shouldOnboardingBeVisible) &&
      numberOfFinishedGames > 0 &&
      !get($gameOver) &&
      !!game.game.sudoku
    )
  },
  (get, set, value: boolean) => {
    set($shouldOnboardingBeVisible, value)
  }
)
