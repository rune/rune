import { LegacyRuneGameCommand, RuneAppCommand, RuneGameEvent } from "../types"

// The native app only support strings for post message communication.
// To identify if received message is used by Rune, we are prefixing all of them with RUNE_MESSAGE_PREFIX. This allows to
// do the identification without having to JSON.parse data first.
const RUNE_MESSAGE_PREFIX = "RUNE_MSG;"

export function stringifyRuneGameEvent(data: RuneGameEvent) {
  return stringifyRuneGameMessage({ runeGameEvent: data })
}

export function getRuneGameCommand(data: unknown) {
  return getRuneGameMessage<{
    runeGameCommand: RuneAppCommand | LegacyRuneGameCommand
  }>(data, "runeGameCommand")
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
  if (globalThis.parent === (globalThis as typeof window)) {
    // eslint-disable-next-line no-console
    console.error("Rune SDK has to run in a container")
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
