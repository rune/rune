import { forceMute } from "../forceMute"

export const masterGainNodes = new Set<GainNode>()

export function registerMasterGainNode(gainNode: GainNode) {
  gainNode.gain.value = forceMute.enabled ? 0 : 1
  masterGainNodes.add(gainNode)
}

export function muteAllMasterGainNodes() {
  for (const gainNode of Array.from(masterGainNodes)) {
    gainNode.gain.value = 0
  }
}

export function unmuteAllMasterGainNodes() {
  for (const gainNode of Array.from(masterGainNodes)) {
    gainNode.gain.value = 1
  }
}
