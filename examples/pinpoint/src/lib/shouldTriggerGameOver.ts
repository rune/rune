import { GameState } from "./types/GameState"
import { numRounds } from "../logic"

export function shouldTriggerGameOver(game: GameState) {
  return game.guesses.length === game.playerIds.length * numRounds
}
