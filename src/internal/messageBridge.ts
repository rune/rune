import { RuneAppCommand, RuneGameEvent } from "../types"
import { showFullScreenError, html } from "./showFullScreenError"

// The native app only support strings for post message communication.
// To identify if received message is used by Rune, we are prefixing all of them with RUNE_MESSAGE_PREFIX. This allows to
// do the identification without having to JSON.parse data first.
const RUNE_MESSAGE_PREFIX = "RUNE_MSG;"

export function stringifyRuneGameEvent(data: RuneGameEvent) {
  return stringifyRuneGameMessage({ runeGameEvent: data })
}

export function getRuneGameCommand(data: unknown) {
  return getRuneGameMessage<{ runeGameCommand: RuneAppCommand }>(
    data,
    "runeGameCommand"
  )
}

export function postRuneEvent(data: RuneGameEvent) {
  // We only expect to send Game events through postMessages
  const event = stringifyRuneGameEvent(data)

  // Post message for Native app
  if (globalThis.ReactNativeWebView) {
    globalThis.ReactNativeWebView.postMessage(event)

    return
  }

  // Game is not running in iframe, don't try to send a message and notify user
  if (
    globalThis.parent === (globalThis as typeof window) &&
    data.type !== "WINDOW_ERR"
  ) {
    // eslint-disable-next-line no-console
    console.error(
      "Games using the Rune SDK must be tested using Rune CLI. See https://github.com/rune/rune-games-cli for instructions."
    )

    showFullScreenError(
      {
        header: "⚠️ You need to use the Rune CLI to test your game",
        body: html`
          <div>
            Games using the Rune SDK must be tested using the Rune CLI. The CLI
            simulates running your game inside the Rune app and provides
            debugging tools. You can install and run the CLI by running these
            commands in your terminal:
          </div>
          <div>
            <pre>
${`\
npm install -g rune-games-cli
cd yourGameFolder
rune start`}</pre
            >
          </div>
          <div>See https://github.com/rune/rune-games-cli for more info.</div>
        `,
      },
      { replaceLinks: true }
    )

    return
  }

  // Post message for iframe
  globalThis.parent.postMessage(event, "*")
}

export function stringifyRuneGameMessage<T>(message: T) {
  return `${RUNE_MESSAGE_PREFIX}${JSON.stringify(message)}`
}

export function getRuneGameMessage<MessageType>(
  data: unknown,
  key: keyof MessageType
): MessageType[keyof MessageType] | null {
  if (!isRuneGameMessage(data)) {
    return null
  }

  const message = parseRuneMessage<MessageType>(data)

  if (!message[key]) {
    throw new Error(
      `Wrong message received. Expected to find: ${key}, but the message was: ${JSON.stringify(
        message
      )}`
    )
  }

  return message[key]
}

function parseRuneMessage<MessageType>(msg: string): MessageType {
  return JSON.parse(msg.slice(RUNE_MESSAGE_PREFIX.length))
}

function isRuneGameMessage(data: unknown): data is string {
  return typeof data === "string" && data.startsWith(RUNE_MESSAGE_PREFIX)
}
