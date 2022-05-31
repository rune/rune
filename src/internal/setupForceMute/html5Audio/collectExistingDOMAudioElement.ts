import { registerAudioElement } from "./audioElements"

export function collectExistingDOMAudioElement() {
  for (const audio of Array.from(document.getElementsByTagName("audio"))) {
    registerAudioElement(audio)
  }
}
