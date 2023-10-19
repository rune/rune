import { GameState } from "./types.ts"

import { countdownDurationSeconds } from "./logicConfig.ts"
import { getRandomInitialSection } from "./getRandomInitialSection.ts"

export function newRound(game: GameState) {
  game.stage = "countdown"
  game.countdownTimer = countdownDurationSeconds
  game.timerStartedAt = Rune.gameTime()
  game.collisionGrid = {}

  for (const player of game.players) {
    player.state = "alive"

    const snake = game.snakes[player.playerId]

    snake.sections = [getRandomInitialSection()]
    snake.turning = "none"
    snake.gapCounter = 0
  }
}
