// This code serves as a bridge to allow cross-domain communication between the
// website and the game loaded in an iframe using the postMessage api
// or the webview in the native app.
import { getRuneGameCommand } from "../messageBridge"
import { RuneExport } from "../types"

export function messageEventHandler(Rune: RuneExport) {
  return (event: MessageEvent) => {
    //We only expect to get Game commands from postMessages
    const command = getRuneGameCommand(event)

    //Ignore non Rune messages
    if (!command) {
      return
    }

    if (!command.type || !Rune[command.type]) {
      throw new Error(`Received incorrect message: ${command}`)
    }

    Rune[command.type]()
  }
}

export function setupMessageBridge(Rune: RuneExport) {
  const eventHandler = messageEventHandler(Rune)
  globalThis.addEventListener("message", eventHandler)

  return eventHandler
}
