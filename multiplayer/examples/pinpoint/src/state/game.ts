import { atom } from "jotai"
import { GameState } from "../types/GameState"

export const $game = atom<GameState | undefined>(undefined)
