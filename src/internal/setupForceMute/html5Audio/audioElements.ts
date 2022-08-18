import { originalMute, desiredMuteStates } from "./overrideMediaElementMute"
import { forceMute } from "../forceMute"

const audioElements = new Set<HTMLAudioElement>()

export function registerAudioElement(audioElement: HTMLAudioElement) {
  desiredMuteStates.set(audioElement, originalMute?.get?.call(audioElement))
  originalMute?.set?.call(audioElement, forceMute.enabled)
  audioElements.add(audioElement)
}

export function unregisterAudioElement(audioElement: HTMLAudioElement) {
  desiredMuteStates.delete(audioElement)
  audioElements.delete(audioElement)
}

export function muteAllAudioElements() {
  for (const audioElement of Array.from(audioElements)) {
    originalMute?.set?.call(audioElement, true)
  }
}
