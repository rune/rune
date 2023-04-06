import { atom } from "jotai"
import { GameState } from "../types/GameState"
import { Players } from "rune-games-sdk/multiplayer"

export const $game = atom<GameState | undefined>(undefined)

export const $players = atom<Players | undefined>(undefined)

export const $myPlayerId = atom<string | undefined>(undefined)
