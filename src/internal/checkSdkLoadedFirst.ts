import { showFullScreenError } from "./showFullScreenError"

export function checkSdkLoadedFirst() {
  const scripts = document.getElementsByTagName("script")

  if (scripts.length !== 1) {
    showFullScreenError({
      header: "⚠️ Other scripts are imported before the Rune SDK script",
      body: "Update your <pre>index.html</pre> file so that the Rune SDK script tag is included before any other scripts. This ensures that the SDK is fully loaded before the rest of the game.",
    })

    throw new Error(
      "Rune Games SDK script tag must be included above any other scripts in index.html"
    )
  }
}
