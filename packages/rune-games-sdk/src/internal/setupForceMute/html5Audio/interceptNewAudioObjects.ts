import { registerAudioElement } from "./audioElements"

const OriginalAudio = globalThis.Audio

export function interceptNewAudioObjects() {
  // @ts-ignore
  globalThis.Audio = function (src?: string) {
    const audio = new OriginalAudio(src)

    registerAudioElement(audio)

    return audio
  }

  globalThis.Audio.prototype = OriginalAudio.prototype
}
