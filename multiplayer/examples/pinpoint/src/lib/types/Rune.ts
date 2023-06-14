import { RuneClient } from "rune-games-sdk/multiplayer"
import { GameState } from "./GameState"
import { GameActions } from "./GameActions"

declare global {
  const Rune: RuneClient<GameState, GameActions>
}
