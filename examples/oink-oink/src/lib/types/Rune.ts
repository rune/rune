import { RuneClient } from "rune-sdk/multiplayer"
import { GameState } from "./GameState"
import { GameActions } from "./GameActions"

declare global {
  const Rune: RuneClient<GameState, GameActions>
}
