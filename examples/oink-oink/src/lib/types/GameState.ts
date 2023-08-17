import { PlayerId } from "rune-games-sdk/multiplayer"

export interface GameState {
  players: {
    id: PlayerId
    readyToStart: boolean
  }[]
  gameStarted: boolean
}
