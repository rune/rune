import { atom } from "jotai"
import { GameState } from "../types/GameState"
import { $myPlayerId } from "./myPlayerId"

export const $game = atom<GameState | undefined>(undefined)

export const $guesses = atom((get) => {
  const game = get($game)

  return (
    game?.guesses.filter((guess) => guess.round === game.currentRound) ?? []
  )
})

export const $myGuess = atom((get) => {
  const guesses = get($guesses)
  const myPlayerId = get($myPlayerId)
  return guesses.find((guess) => guess.playerId === myPlayerId)
})
