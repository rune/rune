//@ts-nocheck
import { PlayerId, DuskClient } from "dusk-games-sdk"

declare global {
  const Dusk: DuskClient<GameState, GameActions>
}

function claimCell() {
  Dusk.invalidAction()
}

Dusk.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
  setup,
  actions: { claimCell },
})
