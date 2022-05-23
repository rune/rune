// This code serves as a bridge to allow cross-domain communication between the
// website and the game loaded in an iframe using the postMessage api
// or the webview in the native app.
import { getRuneGameCommand } from "./messageBridge"
import { StateMachineService } from "./stateMachine"

function exhaustiveCheck(_: never) {}

export function messageEventHandler(stateMachineService: StateMachineService) {
  return (event: MessageEvent) => {
    //We only expect to get Game commands from postMessages
    const command = getRuneGameCommand(event.data)

    //Ignore non Rune messages
    if (!command) {
      return
    }

    if (!command.type) {
      throw new Error(`Received incorrect message: ${command}`)
    }

    //TODO - remove the _ commands after all games/clients are migrated to v2
    switch (command.type) {
      case "pauseGame":
      case "_pauseGame":
        return stateMachineService.send("onAppPause")
      case "requestScore":
      case "_requestScore":
        return stateMachineService.send("onAppRequestScore")
      case "restartGame":
        return stateMachineService.send("onAppRestart")
      case "playGame":
      case "_resumeGame":
        return stateMachineService.send("onAppPlay")
      case "_startGame":
        return stateMachineService.send("onAppStart (legacy)")
    }
    exhaustiveCheck(command)
  }
}

export function setupMessageBridge(
  stateMachineService: StateMachineService,
  useDocumentForPostMessages: boolean
) {
  const eventHandler = messageEventHandler(stateMachineService)

  //According to https://github.com/react-native-webview/react-native-webview/issues/356
  //android webview can only listen to post messages on document (while everything else uses window for that).
  if (useDocumentForPostMessages) {
    //The MDN Web API docs do not even list this action, so we need to use any
    document.addEventListener("message" as any, eventHandler)
  } else {
    globalThis.addEventListener("message", eventHandler)
  }

  return eventHandler
}
