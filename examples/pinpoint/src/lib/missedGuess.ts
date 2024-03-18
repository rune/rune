import { GameState } from "./types/GameState"

export function missedGuess(playerId: string, game: GameState) {
  return {
    playerId,
    round: game.currentRound,
    location: [0, 0],
    distance: Infinity,
    missed: true,
    score: 0,
  }
}
