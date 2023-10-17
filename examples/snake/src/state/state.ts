import { atom, createStore } from "jotai"
import { GameState } from "../logic/logic.ts"
import { Players, PlayerId } from "rune-games-sdk"

export const store = createStore()

export const $state = atom<{
  ready: boolean
  game: GameState
  players: Players
  yourPlayerId: PlayerId | undefined
}>({
  ready: false,
  game: {
    collisionGrid: [],
    players: [],
  },
  players: {},
  yourPlayerId: undefined,
})

export const $ready = atom((get) => get($state).ready)

export const $players = atom((get) => get($state).players)

export const $game = atom((get) => get($state).game)
