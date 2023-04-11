import { Howl } from "howler"

export const sounds = {
  guessSubmit: new Howl({ src: [require("./src/guessSubmit.mp3")] }),
  otherPlayerGuess: new Howl({ src: [require("./src/otherPlayerGuess.mp3")] }),
  resultsMap: new Howl({ src: [require("./src/resultsMap.wav")] }),
  scoreIncrease: new Howl({ src: [require("./src/scoreIncrease.mp3")] }),
}
