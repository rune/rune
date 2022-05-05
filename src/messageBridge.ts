import { RuneGameCommand, RuneGameEvent } from "./types"

//The native app only support strings for post message communication.
//To identify if received message is used by Rune, we are prefixing all of them with RUNE_MESSAGE_PREFIX. This allows to
//do the identification without having to JSON.parse data first.
const RUNE_MESSAGE_PREFIX = "RUNE_MSG;"

export function getRuneGameEvent(event: MessageEvent) {
  return getRuneGameMessage<{ runeGameEvent: RuneGameEvent }>(event, "runeGameEvent")
}

export function stringifyRuneGameCommand(data: RuneGameCommand) {
  return stringifyRuneGameMessage({ runeGameCommand: data })
}

export function stringifyRuneGameEvent(data: RuneGameEvent) {
  return stringifyRuneGameMessage({ runeGameEvent: data })
}

export function getRuneGameCommand(event: MessageEvent) {
  return getRuneGameMessage<{ runeGameCommand: RuneGameCommand }>(
    event,
    "runeGameCommand"
  )
}

export function postRuneEvent(data: RuneGameEvent) {
  //TODO remove when all legacy native clients are migrated
  if (globalThis.postRuneEvent) {
    globalThis.postRuneEvent(data)
    return
  }

  //We only expect to send Game events through postMessages
  const event = stringifyRuneGameEvent(data)

  //Post message for Native app
  if (globalThis.ReactNativeWebView) {
    globalThis.ReactNativeWebView.postMessage(event)

    return
  }

  //Game is not running in iframe, don't try to send a message and notify user
  if (globalThis.parent === (globalThis as typeof window)) {
    console.error("Rune SDK is supposed to run in a container")
    return
  }

  //Post message for iframe
  globalThis.parent.postMessage(event, "*")
}

function stringifyRuneGameMessage<T>(message: T) {
  return `${RUNE_MESSAGE_PREFIX}${JSON.stringify(message)}`
}

function getRuneGameMessage<MessageType>(
  event: MessageEvent,
  key: keyof MessageType
): MessageType[keyof MessageType] | null {
  if (!isRuneGameMessage(event)) {
    return null
  }

  const message = parseRuneMessage<MessageType>(event.data)

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

function isRuneGameMessage(event: MessageEvent): event is MessageEvent<string> {
  return typeof event.data === "string" && event.data.startsWith(RUNE_MESSAGE_PREFIX)
}
