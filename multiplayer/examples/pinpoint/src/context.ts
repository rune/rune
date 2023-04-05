import { createContext } from "react"
import { Players } from "rune-games-sdk/multiplayer"
import { GameState } from "./types/GameState"

export const GameContext = createContext<GameState>({} as GameState)

export const PlayersContext = createContext<Players>({} as Players)

export const MyPlayerIdContext = createContext<string | undefined>(undefined)
