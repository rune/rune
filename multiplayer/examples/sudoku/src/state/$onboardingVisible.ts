import { atom } from "jotai"
import { $gameOver, $game } from "./$game"

const $shouldOnboardingBeVisible = atom(true)

export const $onboardingVisible = atom(
  (get) =>
    get($shouldOnboardingBeVisible) &&
    !get($gameOver) &&
    !!get($game)?.game.sudoku,
  (get, set, value: boolean) => {
    set($shouldOnboardingBeVisible, value)
  }
)
