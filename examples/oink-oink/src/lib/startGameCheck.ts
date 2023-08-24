import { GameState } from "./types/GameState"
import { setActor } from "./setActor"
import { newTurn } from "./newTurn"

export function startGameCheck(game: GameState) {
  if (game.gameStarted) throw Rune.invalidAction()

  if (game.players.some((player) => !player.readyToStart)) return

  game.gameStarted = true

  setActor(game, "first")
  newTurn(game)
}
