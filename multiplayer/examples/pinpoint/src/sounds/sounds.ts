import { Howl } from "howler"

export const sounds = {
  guessSubmit: new Howl({ src: ["sounds/guessSubmit.mp3"] }),
  otherPlayerGuess: new Howl({ src: ["sounds/otherPlayerGuess.mp3"] }),
  resultsMap: new Howl({ src: ["sounds/resultsMap.wav"] }),
  scoreIncrease: new Howl({ src: ["sounds/scoreIncrease.mp3"] }),
}
