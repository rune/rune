// This code serves as a bridge to allow cross-domain communication between the
// website and the game loaded in an iframe using the postMessage api
// or the webview in the native app.
import { getRuneGameCommand } from "./messageBridge"
import { RuneExport } from "../types"

export function messageEventHandler(Rune: RuneExport) {
  return (event: MessageEvent) => {
    //We only expect to get Game commands from postMessages
    const command = getRuneGameCommand(event.data)

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

export function setupMessageBridge(
  Rune: RuneExport,
  useDocumentForPostMessages: boolean
) {
  const eventHandler = messageEventHandler(Rune)

  //According to https://github.com/react-native-webview/react-native-webview/issues/356
  //This is the only way android webview can listen to post messages.
  //The message only get sent to either window or document, not to both of them.

  if (useDocumentForPostMessages) {
    //The MDN Web API docs do not even list this action, so we need to use any
    document.addEventListener("message" as any, eventHandler)
  } else {
    globalThis.addEventListener("message", eventHandler)
  }

  return eventHandler
}
