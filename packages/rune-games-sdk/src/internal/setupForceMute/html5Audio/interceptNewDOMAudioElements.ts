import { registerAudioElement, unregisterAudioElement } from "./audioElements"

export function interceptNewDOMAudioElements() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLAudioElement) {
          registerAudioElement(node)
        }
      })
      mutation.removedNodes.forEach((node) => {
        if (node instanceof HTMLAudioElement) {
          unregisterAudioElement(node)
        }
      })
    })
  })

  observer.observe(document, { childList: true, subtree: true })
}
