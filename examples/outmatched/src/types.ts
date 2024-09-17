import type { RuneClient, PlayerId } from "rune-sdk/multiplayer"

export type Tile = number
export type Cells = Tile[]
export type MaybeCells = (Tile | null)[]
export interface PlayerState {
  score: number
  shufflesRemaining: number
  extraMovesRemaining: number
}
export type PlayersState = Record<PlayerId, PlayerState>

export interface BoardChange {
  removed: number[][]
  merged: {
    index: number
    tile: number
    vertical: boolean
    indices: number[]
  }[]
  cleared: { tile: number; index: number; indices: number[] }[]
  moved: Record<number, number>
  added: Record<number, number>
  message?: "out-of-moves"
}

export interface GameState {
  playerIds: PlayerId[]
  currentPlayerIndex: number
  movesPlayed: number
  movesPerRound: number
  roundsPlayed: number
  startingScore: number
  cells: Cells
  highlightedCells: Record<number, PlayerId>
  players: PlayersState
  changes: BoardChange[]
}

export type GameActions = {
  swap: (params: { sourceIndex: number; targetIndex: number }) => void
  extraMove: () => void
  shuffle: () => void
  highlight: (params: { index: number }) => void
}

declare global {
  const Rune: RuneClient<GameState, GameActions>
}
