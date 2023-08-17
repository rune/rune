import { GameState } from "../lib/types/GameState"
import { atom } from "jotai"
import { Players, PlayerId } from "rune-games-sdk/multiplayer"

export const $state = atom<
  | {
      game: GameState
      players: Players
      yourPlayerId: PlayerId | undefined
    }
  | undefined
>(undefined)

export const $game = atom((get) => get($state)?.game)

export const $playersInfo = atom((get) => get($state)?.players)

export const $yourPlayerId = atom((get) => get($state)?.yourPlayerId)

export const $gameStarted = atom((get) => get($game)?.gameStarted)

export const $players = atom((get) => get($game)?.players)

export const $yourPlayer = atom((get) => {
  const yourPlayerId = get($yourPlayerId)
  const players = get($players)

  if (!yourPlayerId || !players) return undefined

  return players?.find((player) => player.id === yourPlayerId)
})
