import type { RuneClient } from "rune-games-sdk/multiplayer.js"
import { helpers } from "./shared/helpers.js"

export interface GameState {
  count: number
}

type GameActions = {
  increment: (params: { amount: number }) => void
}

declare global {
  const Rune: RuneClient<GameState, GameActions>
}

export function getCount(game: GameState) {
  return game.count
}

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: (): GameState => {
    return { count: 0 }
  },
  actions: {
    increment: ({ amount }, { game }) => {
      console.log(helpers.deep)
      console.log(helpers.flat)
      game.count += amount
    },
  },
})
