// This code serves as a bridge to allow cross-domain communication between the
// website and the game loaded in an iframe using the postMessage api
export function setupEventBridge() {
  if (globalThis.postRuneEvent) return

  const challengeNumber = +(
    new URLSearchParams(globalThis.location.search).get("challengeNumber") ?? "1"
  )

  if (!isNaN(challengeNumber)) {
    globalThis._runeChallengeNumber = challengeNumber
  }

  globalThis.postRuneEvent = (event: any) => {
    window.parent.postMessage({ runeGameEvent: event }, "*")
  }

  window.addEventListener("message", (msg) => {
    if ((globalThis as any).Rune && isRuneGameMessage(msg)) {
      ;(globalThis as any).Rune[msg.data.runeGameCommand.type]()
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
