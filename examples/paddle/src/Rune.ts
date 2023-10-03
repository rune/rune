import { RuneClient } from "rune-games-sdk"
import { GameActions, GameState } from "./logic"

export type RuneTyped = RuneClient<GameState, GameActions>

declare global {
  const Rune: RuneTyped
}
