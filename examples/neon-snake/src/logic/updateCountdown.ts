import { countdownDurationSeconds } from "./logicConfig.ts"
import { GameState } from "./types.ts"

export function updateCountdown(game: GameState) {
  const timePassed = (Rune.gameTime() - game.timerStartedAt) / 1000

  if (timePassed > countdownDurationSeconds) {
    game.stage = "playing"
  } else {
    game.countdownTimer = Math.ceil(countdownDurationSeconds - timePassed)
  }
}
