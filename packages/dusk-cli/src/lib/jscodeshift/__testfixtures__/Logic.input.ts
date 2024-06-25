//@ts-nocheck
import { PlayerId, RuneClient } from "rune-games-sdk/multiplayer"

declare global {
  const Rune: RuneClient<GameState, GameActions>
}

function claimCell() {
  Rune.invalidAction()
}

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
  setup,
  actions: { claimCell },
})
