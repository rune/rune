import { GameState } from "./types/GameState"

export function hasEveryoneGuessed(game: GameState) {
  return (
    game.guesses.filter((guess) => guess.round === game.currentRound).length ===
    game.playerIds.length
  )
}
