import { forceMute } from "./forceMute"
import {
  muteAllMasterGainNodes,
  unmuteAllMasterGainNodes,
} from "./webAudio/masterGainNodes"
import { muteAllAudioElements } from "./html5Audio/audioElements"
import { resetAllMediaElementMutedStates } from "./html5Audio/overrideMediaElementMute"

export function setForceMuteStatus(muted: boolean) {
  if (muted && !forceMute.enabled) {
    forceMute.enabled = true
    muteAllMasterGainNodes()
    muteAllAudioElements()
  }

  if (!muted && forceMute.enabled) {
    forceMute.enabled = false
    unmuteAllMasterGainNodes()
    resetAllMediaElementMutedStates()
  }
}
