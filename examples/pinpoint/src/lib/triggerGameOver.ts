import { GameState } from "./types/GameState"

export function triggerGameOver(game: GameState) {
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
    delayPopUp: true,
  })
}
