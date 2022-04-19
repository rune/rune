// This code serves as a bridge to allow cross-domain communication between the
// website and the game loaded in an iframe using the postMessage api
export function setupEventBridge() {
  const windowRef: any = window

  if (windowRef.postRuneEvent) return

  const challengeNumber = +(
    new URLSearchParams(windowRef.location.search).get("challengeNumber") ?? "1"
  )

  if (!isNaN(challengeNumber)) {
    windowRef._runeChallengeNumber = challengeNumber
  }

  windowRef.postRuneEvent = (event: any) => {
    window.parent.postMessage({ runeGameEvent: event }, "*")
  }

  window.addEventListener("message", (msg) => {
    if (windowRef.Rune && isRuneGameMessage(msg)) {
      windowRef.Rune[msg.data.runeGameCommand.type]()
    }
  })
}

function isRuneGameMessage(msg: any) {
  return (
    typeof msg.data === "object" &&
    !!msg.data &&
    typeof msg.data.runeGameCommand === "object"
  )
}
