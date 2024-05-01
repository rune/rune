import { RuneClient } from "rune-games-sdk"
import { GameState, Persisted } from "./GameState"
import { GameActions } from "./GameActions"

declare global {
  const Rune: RuneClient<GameState, GameActions, Persisted>
}
