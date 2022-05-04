// This code serves as a bridge to allow cross-domain communication between the
// website and the game loaded in an iframe using the postMessage api
// or the webview in the native app.
import { getRuneGameCommand, stringifyRuneGameEvent } from "../messageBridge"
import { RuneGameEvent } from "../types"

export function setupMessageBridge() {
  globalThis.postRuneEvent = (data: RuneGameEvent) => {
    //We only expect to send Game events through postMessages
    const event = stringifyRuneGameEvent(data)

    globalThis.ReactNativeWebView
      ? //Post message for Native app
        globalThis.ReactNativeWebView.postMessage(event)
      : //Post message for iframe
        globalThis.parent.postMessage(event, "*")
  }

  globalThis.addEventListener("message", (event: MessageEvent) => {
    if (globalThis.Rune) {
      //We only expect to get Game commands from postMessages
      const command = getRuneGameCommand(event)

      //Ignore non Rune messages
      if (!command) {
        return
      }

      if (!command.type || !globalThis.Rune[command.type]) {
        throw new Error(`Received incorrect message!: ${command}`)
      }

      globalThis.Rune[command.type]()
    }
  })
}
