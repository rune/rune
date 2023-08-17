import { GameState } from "../lib/types/GameState"
import { atom } from "jotai"
import { Players, PlayerId } from "rune-games-sdk/multiplayer"

export const $state = atom<{
  game: GameState
  players: Players
  yourPlayerId: PlayerId | undefined
}>({
  game: {
    players: [],
    gameStarted: false,
    round: 0,
    turns: [],
    guesses: [],
  },
  players: {},
  yourPlayerId: undefined,
})

export const $game = atom((get) => get($state).game)

export const $playersInfo = atom((get) => get($state).players)

export const $yourPlayerId = atom((get) => get($state).yourPlayerId)

export const $gameStarted = atom((get) => get($game).gameStarted)

export const $players = atom((get) => {
  const players = get($game).players
  const playersInfo = get($playersInfo)

  return players.map((player) => {
    const info = playersInfo[player.id]

    return {
      ...player,
      info,
    }
  })
})

export const $yourPlayer = atom((get) => {
  const yourPlayerId = get($yourPlayerId)
  const players = get($players)

  return players.find((player) => player.id === yourPlayerId)
})

export const $actorPlayer = atom((get) =>
  get($players).find((player) => player.actor)
)

export const $round = atom((get) => get($game).round)

export const $currentTurn = atom((get) => get($game).turns.at(-1))
