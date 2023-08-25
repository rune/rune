import { Animal, Emotion } from "./GameState"

export type GameActions = {
  setReadyToStart: () => void
  makeGuess: (guess: { animal: Animal; emotion: Emotion }) => void
  nextRound: () => void
}
