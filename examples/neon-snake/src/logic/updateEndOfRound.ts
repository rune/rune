import { endOfRoundDurationSeconds } from "./logicConfig.ts"
import { newRound } from "./newRound.ts"
import { GameState } from "./types.ts"

export function updateEndOfRound(game: GameState) {
  const timePassed = (Rune.gameTime() - game.timerStartedAt) / 1000

  if (timePassed > endOfRoundDurationSeconds) {
    newRound(game)
  }
}
