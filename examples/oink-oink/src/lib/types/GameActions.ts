import { Animal, Emotion, GameState } from "./GameState"

export type GameActions = {
  setReadyToStart: () => void
  makeGuess: (guess: {
    animal: Animal
    emotion: Emotion
    round: GameState["round"]
  }) => void
  nextRound: () => void
  skipGuess: () => void
}
