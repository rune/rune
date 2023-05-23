import { Howl } from "howler"

// These sounds are unavailable in the open-source version because of licensing reasons
export const sounds = {
  setValue: new Howl({ src: ["sounds/setValue.mp3"] }),
  hint: new Howl({ src: ["sounds/hint.mp3"] }),
  error: new Howl({ src: ["sounds/error.mp3"] }),
  note: new Howl({ src: ["sounds/note.mp3"] }),
  setDifficulty: new Howl({ src: ["sounds/setDifficulty.mp3"] }),
  success: new Howl({ src: ["sounds/success.mp3"] }),
  backspace: new Howl({ src: ["sounds/backspace.mp3"] }),
}
