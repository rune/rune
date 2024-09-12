import { atom } from "jotai"
import { GameState, Persisted } from "../lib/types/GameState"
import { $myPlayerId } from "./myPlayerId"
import { hasEveryoneGuessed } from "../lib/hasEveryoneGuessed"
import { GameStateWithPersisted } from "rune-sdk"

export const $game = atom<
  GameStateWithPersisted<GameState, Persisted> | undefined
>(undefined)

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

export const $roundTimerStartedAt = atom((get) => {
  return get($game)?.roundTimerStartedAt
})

export const $everyoneGuessed = atom((get) => {
  const game = get($game)
  return game && hasEveryoneGuessed(game)
})
