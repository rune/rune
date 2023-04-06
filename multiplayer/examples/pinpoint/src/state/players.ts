import { atom } from "jotai"
import { Players } from "rune-games-sdk/multiplayer"

export const $players = atom<Players | undefined>(undefined)
