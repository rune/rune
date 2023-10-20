import { atom, createStore } from "jotai"
import { Players, PlayerId } from "rune-games-sdk"
import { GameState } from "../logic/types.ts"

export const store = createStore()

export const $state = atom<{
  ready: boolean
  game: GameState
  players: Players
  yourPlayerId: PlayerId | undefined
}>({
  ready: false,
  game: {
    stage: "gettingReady",
    collisionGrid: {},
    players: [],
    snakes: {},
    countdownTimer: 0,
    timerStartedAt: 0,
    lastRoundWinnerId: undefined,
  },
  players: {},
  yourPlayerId: undefined,
})

export const $ready = atom((get) => get($state).ready)

export const $players = atom((get) => get($state).players)

export const $game = atom((get) => get($state).game)

export const $playerInfos = atom((get) => get($game).players)

export const $stage = atom((get) => get($game).stage)

export const $countdownTimer = atom((get) => get($game).countdownTimer)

export const $yourPlayerId = atom((get) => get($state).yourPlayerId)

export const $lastRoundWinnerId = atom((get) => get($game).lastRoundWinnerId)

export const $winnerColor = atom(
  (get) =>
    get($game).players.find(
      (player) => player.playerId === get($lastRoundWinnerId),
    )?.color,
)
