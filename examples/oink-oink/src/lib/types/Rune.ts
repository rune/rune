import { DuskClient } from "dusk-games-sdk/multiplayer"
import { GameState } from "./GameState"
import { GameActions } from "./GameActions"

declare global {
  const Dusk: DuskClient<GameState, GameActions>
}
