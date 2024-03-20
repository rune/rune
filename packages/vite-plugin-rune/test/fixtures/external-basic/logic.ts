import type { RuneClient } from "rune-games-sdk/multiplayer"
import sum from "math-sum"

export interface GameState {
  count: number
}

type GameActions = {}

declare global {
  const Rune: RuneClient<GameState, GameActions>
}

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: (): GameState => {
    return { count: sum([1, 2, 3]) }
  },
  actions: {},
})
