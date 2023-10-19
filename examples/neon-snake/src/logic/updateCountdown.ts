import { countdownDurationSeconds } from "./logicConfig.ts"
import { GameState } from "./types.ts"

export function updateCountdown(game: GameState) {
  game.timer = Math.ceil(
    countdownDurationSeconds - (Rune.gameTime() - game.timerStartedAt) / 1000,
  )

  if (game.timer <= 0) {
    game.timer = 0
    game.stage = "playing"
  }
}
