import { registerMasterGainNode } from "./masterGainNodes"

const originalConnect = Object.getOwnPropertyDescriptor(
  AudioNode.prototype,
  "connect"
)

// We intercept the "connect() to destination" call and inject one last gain
// node before the end of the pipeline, which then lets us adjust audio volume
// globally
export function interceptAudioNodeConnectToInjectMasterGainNode() {
  Object.defineProperty(AudioNode.prototype, "connect", {
    ...originalConnect,
    value(...args: any[]) {
      const destination = args[0]

      if (destination instanceof AudioDestinationNode) {
        const gainNode = destination.context.createGain()

        originalConnect?.value.call(this, gainNode)
        originalConnect?.value.apply(gainNode, args)

        registerMasterGainNode(gainNode)

        return destination
      }

      return originalConnect?.value.apply(this, args)
    },
  })
}
