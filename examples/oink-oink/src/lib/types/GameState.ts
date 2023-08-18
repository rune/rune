import { PlayerId } from "rune-games-sdk/multiplayer"

export const animals = [
  "dog",
  "lion",
  "pig",
  "cat",
  "elephant",
  "frog",
  "cow",
  "sheep",
] as const

export const emotions = [
  "laughing",
  "scared",
  "angry",
  "sleepy",
  "sneezing",
  "crying",
  "ghost",
  "cold",
] as const

export type Animal = (typeof animals)[number]

export type Emotion = (typeof emotions)[number]

export interface GameState {
  players: {
    id: PlayerId
    readyToStart: boolean
    actor: boolean
    score: number
    latestScore: number
  }[]
  gameStarted: boolean
  round: number
  currentTurn: {
    animal: Animal
    emotion: Emotion
    stage: "countdown" | "acting" | "result"
    timerStartedAt?: number
  } | null
  guesses: {
    playerId: PlayerId
    animal: Animal
    emotion: Emotion
  }[]
}
