import { DuskClient } from "dusk-games-sdk"
import { GameState, Persisted } from "./GameState"
import { GameActions } from "./GameActions"

declare global {
  const Dusk: DuskClient<GameState, GameActions, Persisted>
}
