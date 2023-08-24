import { Howl } from "howler"

// These sounds are unavailable in the open-source version because of licensing reasons
export const sounds = {
  correctGuess: new Howl({ src: ["sounds/correctGuess.mp3"] }),
  countdown: new Howl({ src: ["sounds/countdown.mp3"] }),
  endOfTurn: new Howl({ src: ["sounds/endOfTurn.mp3"] }),
  guessButton: new Howl({ src: ["sounds/guessButton.mp3"] }),
  otherUserCorrectGuess: new Howl({
    src: ["sounds/otherUserCorrectGuess.mp3"],
  }),
  scoreIncrease: new Howl({ src: ["sounds/scoreIncrease.mp3"] }),
  timer: new Howl({ src: ["sounds/timer.mp3"], loop: true }),
}
