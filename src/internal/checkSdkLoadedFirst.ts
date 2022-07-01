import { showFullScreenError } from "./showFullScreenError"

export function checkSdkLoadedFirst() {
  const scripts = document.getElementsByTagName("script")

  if (scripts.length !== 1) {
    showFullScreenError(
      "Rune Games SDK script tag must be included above any other scripts in index.html"
    )

    throw new Error(
      "Rune Games SDK script tag must be included above any other scripts in index.html"
    )
  }
}
