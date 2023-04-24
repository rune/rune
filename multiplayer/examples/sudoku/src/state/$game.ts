import { GameState, Color } from "../lib/types/GameState"
import { atom } from "jotai"
import { Players, PlayerId } from "rune-games-sdk/multiplayer"
import { cellPointer } from "../lib/cellPointer"

export const $game = atom<
  | {
      game: GameState
      players: Players
      yourPlayerId: PlayerId | undefined
    }
  | undefined
>(undefined)

export const $board = atom((get) => get($game)?.game.sudoku?.board)

export const $gameOver = atom((get) => !!get($game)?.game.gameOver)

export const $selections = atom((get) =>
  Object.entries(get($game)?.game.playerState ?? {}).reduce<{
    [index: number]: string[] | undefined
  }>(
    (acc, [playerId, { selection }]) => ({
      ...acc,
      [cellPointer(selection)]: (acc[cellPointer(selection)] ?? []).concat(
        playerId
      ),
    }),
    {}
  )
)

export const $yourSelection = atom((get) => {
  const yourPlayerId = get($yourPlayerId)
  if (!yourPlayerId) return undefined
  return get($game)?.game.playerState[yourPlayerId].selection
})

export const $yourPlayerId = atom((get) => get($game)?.yourPlayerId)

export const $colors = atom((get) =>
  Object.entries(get($game)?.game.playerState ?? {}).reduce<{
    [playerId: string]: Color
  }>(
    (acc, [playerId, { color }]) => ({
      ...acc,
      [playerId]: color,
    }),
    {}
  )
)

export const $hints = atom((get) => get($game)?.game.hints ?? [])
