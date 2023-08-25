import { GameState, animals, emotions } from "./types/GameState"
import { getRandomItem } from "./getRandomItem"

export function newTurn(game: GameState) {
  game.currentTurn = {
    animal: getRandomItem(animals),
    emotion: getRandomItem(emotions),
    stage: "countdown",
    timerStartedAt: Rune.gameTimeInSeconds(),
  }
}
