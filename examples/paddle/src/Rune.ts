import { DuskClient } from "dusk-games-sdk"
import { GameActions, GameState } from "./logic"

export type DuskTyped = DuskClient<GameState, GameActions>

declare global {
  const Dusk: DuskTyped
}
