import { GameState } from "./types.ts"
import { getNewPlayer } from "./getNewPlayer.ts"

import { countdownDuration } from "./logicConfig.ts"

export function newRound(game: GameState) {
  for (let i = 0; i < game.players.length; i++) {
    game.collisionGrid = []
    game.players[i] = {
      ...getNewPlayer(game.players[i].playerId, game.players[i].color),
      score: game.players[i].score,
    }
    game.stage = "countdown"
    game.timer = countdownDuration
    game.timerStartedAt = Rune.gameTime()
  }
}
