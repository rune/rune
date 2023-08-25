import { GameState } from "./types/GameState"

export function setActor(game: GameState, which: "first" | "next") {
  const actorIndex = game.players.findIndex((player) => player.actor)
  const nextActorIndex = which === "first" ? 0 : actorIndex + 1

  if (~actorIndex) game.players[actorIndex].actor = false
  game.players[nextActorIndex].actor = true
}
