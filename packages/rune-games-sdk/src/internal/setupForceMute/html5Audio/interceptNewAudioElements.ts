import { registerAudioElement } from "./audioElements"

const originalCreateElement = document.createElement

export function interceptNewAudioElements() {
  document.createElement = function (
    tagName: string,
    options?: ElementCreationOptions
  ) {
    const element = originalCreateElement.call(this, tagName, options)

    if (element instanceof HTMLAudioElement) {
      registerAudioElement(element)
    }

    return element
  }
}
