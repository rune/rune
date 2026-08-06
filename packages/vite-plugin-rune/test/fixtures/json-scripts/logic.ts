import type { RuneClient } from "rune-sdk"

export interface GameState {
  count: number
}

type GameActions = {
  increment: (params: { amount: number }) => void
}

declare global {
  const Rune: RuneClient<GameState, GameActions>
}

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: () => ({
    count: 0,
  }),
  actions: {
    increment: ({ amount }, { game }) => {
      game.count += amount
    },
  },
})
