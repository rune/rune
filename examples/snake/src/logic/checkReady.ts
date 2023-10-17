import { GameState } from "./types.ts"
import { countdownDuration } from "./logic.ts"

export function checkReady(game: GameState, allPlayerIds: string[]) {
  if (
    allPlayerIds.every((playerId) => game.readyPlayerIds.includes(playerId))
  ) {
    game.stage = "countdown"
    game.timer = countdownDuration
    game.timerStartedAt = Rune.gameTime()

    for (const player of game.players) {
      player.state = "alive"
    }
  }
}
