import { PlayerId } from "rune-sdk/multiplayer"

export const animals = [
  "dog",
  "lion",
  "duck",
  "cat",
  "horse",
  "chicken",
  "cow",
  "sheep",
  "elephant",
  "goat",
  "mouse",
  "owl",
  "pig",
  "frog",
  "monkey",
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

export type Guess = {
  playerId: PlayerId
  animal: Animal
  emotion: Emotion
  correct: boolean
}

type Score = {
  guessing: number
  acting: number
}

export interface GameState {
  players: {
    id: PlayerId
    readyToStart: boolean
    actor: boolean
    score: Score
    latestTurnScore: Score
    latestRoundScore: Score
  }[]
  gameStarted: boolean
  round: number
  animals: Animal[]
  emotions: Emotion[]
  currentTurn: {
    animal: Animal
    emotion: Emotion
    stage: "countdown" | "acting" | "endOfTurn" | "result"
    timerStartedAt: number
    latestActingStartedAt: number
    showSkipGuessButton: boolean
  } | null
  guesses: Guess[]
  gameOver: boolean
}
