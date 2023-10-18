import { GameState } from "./types.ts"

import { countdownDuration } from "./logicConfig.ts"
import { getInitialLine } from "./getInitialLine.ts"

export function newRound(game: GameState) {
  game.stage = "countdown"
  game.timer = countdownDuration
  game.timerStartedAt = Rune.gameTime()
  game.collisionGrid = []

  for (const player of game.players) {
    player.line = getInitialLine()
    player.state = "alive"
    player.turning = "none"
    player.gapCounter = 0
  }
}
