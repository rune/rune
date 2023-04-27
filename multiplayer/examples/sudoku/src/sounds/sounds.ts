import { Howl } from "howler"

export const sounds = {
  setValue: new Howl({ src: [require("./src/setValue.mp3")] }),
  hint: new Howl({ src: [require("./src/hint.mp3")] }),
  error: new Howl({ src: [require("./src/error.mp3")] }),
  note: new Howl({ src: [require("./src/note.mp3")] }),
  setDifficulty: new Howl({ src: [require("./src/setDifficulty.mp3")] }),
  success: new Howl({ src: [require("./src/success.mp3")] }),
  backspace: new Howl({ src: [require("./src/backspace.mp3")] }),
}
