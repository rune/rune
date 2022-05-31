import { forceMute } from "../forceMute"

export const desiredMuteStates = new Map<HTMLAudioElement, boolean>()

export const originalMute = Object.getOwnPropertyDescriptor(
  HTMLMediaElement.prototype,
  "muted"
)

export function overrideMediaElementMute() {
  Object.defineProperty(HTMLMediaElement.prototype, "muted", {
    get() {
      return desiredMuteStates.get(this) ?? false
    },
    set(value: boolean) {
      desiredMuteStates.set(this, value)

      if (!forceMute.enabled) {
        originalMute?.set?.call(this, value)
      }
    },
  })
}

export function resetAllMediaElementMutedStates() {
  for (const audioElement of Array.from(desiredMuteStates.keys())) {
    originalMute?.set?.call(
      audioElement,
      desiredMuteStates.get(audioElement) ?? false
    )
  }
}
