import { atom } from "jotai"
import { Players } from "rune-sdk/multiplayer"
import { $myPlayerId } from "./myPlayerId"

export const $players = atom<Players | undefined>(undefined)

export const $myPlayer = atom((get) => {
  const players = get($players)
  const myPlayerId = get($myPlayerId)

  return players && myPlayerId ? players[myPlayerId] : undefined
})
