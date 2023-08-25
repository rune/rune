import { GameState } from "./types/GameState"

export function isLastActor(game: GameState) {
  const actorIndex = game.players.findIndex((player) => player.actor)
  return actorIndex + 1 === game.players.length
}
