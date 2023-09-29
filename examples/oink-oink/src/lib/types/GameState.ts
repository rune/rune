import { PlayerId } from "rune-games-sdk/multiplayer"

export const animals = [
  "lion",
  "dog",
  "pig",
  "sheep",
  "elephant",
  "cow",
  "cat",
  "frog",
  "monkey",
  "horse",
  "goat",
  "mouse",
  "owl",
  "duck",
  "chicken",
] as const

export const emotions = [
  "scared",
  "crying",
  "sneezing",
  "ghost",
  "cold",
  "angry",
  "sleepy",
  "laughing",
] as const

export type Animal = (typeof animals)[number]

export type Emotion = (typeof emotions)[number]

export type Guess = {
  playerId: PlayerId
  animal: Animal
  emotion: Emotion
  correct: boolean
}

export interface GameState {
  players: {
    id: PlayerId
    readyToStart: boolean
    actor: boolean
    score: number
    latestTurnScore: number
    latestRoundScore: number
  }[]
  gameStarted: boolean
  round: number
  currentTurn: {
    animal: Animal
    emotion: Emotion
    stage: "countdown" | "acting" | "endOfTurn" | "result"
    timerStartedAt?: number
  } | null
  guesses: Guess[]
  gameOver: boolean
}
