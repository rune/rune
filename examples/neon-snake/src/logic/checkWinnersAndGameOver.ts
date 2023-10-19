import { GameState } from "./types.ts"

import { maxScoreBeforeGameOver } from "./logicConfig.ts"

export function checkWinnersAndGameOver(game: GameState) {
  const playersAlive = game.players.filter((p) => p.state === "alive")

  if (playersAlive.length > 1) return

  if (playersAlive.length === 1) {
    playersAlive[0].score++

    if (playersAlive[0].score === maxScoreBeforeGameOver) {
      Rune.gameOver({
        players: game.players.reduce(
          (acc, p) => ({ ...acc, [p.playerId]: p.score }),
          {},
        ),
      })
    } else {
      game.stage = "endOfRound"
      game.lastRoundWinnerId = playersAlive[0].playerId
      game.timerStartedAt = Rune.gameTime()
    }
  }
}
