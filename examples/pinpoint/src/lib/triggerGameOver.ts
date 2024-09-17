import { GameState, Persisted } from "./types/GameState"
import { GameStateWithPersisted } from "rune-sdk"

export function triggerGameOver(
  game: GameStateWithPersisted<GameState, Persisted>
) {
  game.playerIds.forEach((playerId) => {
    game.persisted[playerId] = {
      numberOfSessions: (game.persisted[playerId]?.numberOfSessions || 0) + 1,
    }
  })

  Rune.gameOver({
    players: game.guesses.reduce(
      (acc, guess) => ({
        ...acc,
        [guess.playerId]: (acc[guess.playerId] ?? 0) + guess.score,
      }),
      {} as {
        [playerId: string]: number
      }
    ),
    minimizePopUp: true,
    delayPopUp: true,
  })
}
