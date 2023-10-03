import { RuneClient } from "rune-games-sdk"
import { GameActions, GameState } from "./logic.ts"

export type RuneTyped = RuneClient<GameState, GameActions>

declare global {
  const Rune: RuneTyped
}
