import { atom } from "jotai"
import { $gameOver } from "./$game"

const $shouldOnboardingBeVisible = atom(true)

export const $onboardingVisible = atom(
  (get) => get($shouldOnboardingBeVisible) && !get($gameOver),
  (get, set, value: boolean) => {
    set($shouldOnboardingBeVisible, value)
  }
)
