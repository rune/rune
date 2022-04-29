export function setupBrowser() {
  //Safari ios throttles requestAnimationFrame when user has not interacted with the iframe at least once.
  //In case the games are not using clicks (for instance only swiping), ios will not treat these interactions
  //with the iframe as user interacting. As a workaround, in the browser we will start overlay with
  //click events disabled and display an invisible div inside the iframe above the canvas.
  //This way the users will click on the transparent div element the very first time. We will let our client
  //know about it with BROWSER_INITIAL_OVERLAY_CLICKED event and the transparent div will remove itself.
  //Afterwards the play/pause will be once again fully controlled by our client.

  const enableInitialOverlayInBrowser = !!new URLSearchParams(
    globalThis.location.search
  ).get("enableInitialOverlayInBrowser")

  if (enableInitialOverlayInBrowser) {
    document.addEventListener("DOMContentLoaded", function () {
      const div = document.createElement("div")
      div.setAttribute(
        "style",
        "top: 0; bottom: 0; left: 0; right: 0; width: 100vw; height: 100vh; position: absolute; z-index: 9999;"
      )

      div.addEventListener("click", () => {
        div.remove()
        if (globalThis.postRuneEvent) {
          globalThis.postRuneEvent({ type: "BROWSER_INITIAL_OVERLAY_CLICKED" })
        }
      })
      document.body.appendChild(div)

      if (globalThis.postRuneEvent) {
        globalThis.postRuneEvent({ type: "BROWSER_IFRAME_LOADED" })
      }
    })
  }
}
