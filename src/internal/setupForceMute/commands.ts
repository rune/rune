import { forceMute } from "./forceMute"
import {
  muteAllMasterGainNodes,
  unmuteAllMasterGainNodes,
} from "./webAudio/masterGainNodes"
import { muteAllAudioElements } from "./html5Audio/audioElements"
import { resetAllMediaElementMutedStates } from "./html5Audio/overrideMediaElementMute"

export function enableForceMute() {
  forceMute.enabled = true
  muteAllMasterGainNodes()
  muteAllAudioElements()
}

export function disableForceMute() {
  forceMute.enabled = false
  unmuteAllMasterGainNodes()
  resetAllMediaElementMutedStates()
}
