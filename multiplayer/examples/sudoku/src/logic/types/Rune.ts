import {
  RuneClient,
  PlayerId,
  GameOverOptions,
  VisualUpdateAction,
  VisualUpdateEvent,
  Players,
} from "rune-games-sdk/multiplayer"
import { GameState, GameActions } from "./GameState"

declare global {
  const Rune: RuneClient
}

declare module "rune-games-sdk/multiplayer" {
  interface RuneShared {
    initLogic: (params: {
      minPlayers: number
      maxPlayers: number
      setup: (playerIds: PlayerId[]) => GameState
      actions: {
        [key in keyof GameActions]: (
          params: Parameters<GameActions[key]>[0],
          { game, playerId }: { game: GameState; playerId: PlayerId }
        ) => void
      }
      events?: {
        playerJoined?: (
          playerId: PlayerId,
          eventContext: { game: GameState }
        ) => void
        playerLeft?: (
          playerId: PlayerId,
          eventContext: { game: GameState }
        ) => void
      }
    }) => void
    invalidAction: () => Error
    gameOver: (options?: GameOverOptions) => void
  }

  interface RuneClient extends RuneShared {
    initClient: (params: {
      visualUpdate: (params: {
        oldGame: GameState
        newGame: GameState
        action?: VisualUpdateAction
        event?: VisualUpdateEvent
        yourPlayerId: PlayerId | undefined
        players: Players
        rollbacks: VisualUpdateAction[]
      }) => void
    }) => void
    actions: GameActions
    version: string
    openExternalApp: (url: string) => void
    clipboardWrite: (text: string) => Promise<{ success: boolean }>
    clipboardRead: () => Promise<{ text: string | null }>
    storageWrite: (key: string, value: string) => Promise<{ success: boolean }>
    storageRead: (key: string) => Promise<{ value: string | null }>
    showGameOverPopUp: () => void
    showInvitePlayers: () => void
  }
}
