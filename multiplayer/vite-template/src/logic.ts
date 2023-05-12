import type { RuneClient } from "rune-games-sdk/multiplayer"

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
      game.count += amount
    },
  },
  events: {
    playerJoined: () => {
      // Handle player joined
    },
    playerLeft() {
      // Handle player left
    },
  },
})
