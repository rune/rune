import { collectExistingDOMAudioElement } from "./html5Audio/collectExistingDOMAudioElement"
import { interceptNewDOMAudioElements } from "./html5Audio/interceptNewDOMAudioElements"
import { interceptNewAudioElements } from "./html5Audio/interceptNewAudioElements"
import { interceptNewAudioObjects } from "./html5Audio/interceptNewAudioObjects"
import { overrideMediaElementMute } from "./html5Audio/overrideMediaElementMute"
import { interceptAudioNodeConnectToInjectMasterGainNode } from "./webAudio/interceptAudioNodeConnectToInjectMasterGainNode"

export function setupForceMute() {
  collectExistingDOMAudioElement()
  interceptNewDOMAudioElements()
  interceptNewAudioElements()
  interceptNewAudioObjects()
  overrideMediaElementMute()

  interceptAudioNodeConnectToInjectMasterGainNode()
}
