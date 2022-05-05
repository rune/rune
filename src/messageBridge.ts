import { RuneGameCommand, RuneGameEvent } from "./types"

//The native app only support strings for post message communication.
//To identify if received message is used by Rune, we are prefixing all of them with RUNE_MESSAGE_PREFIX. This allows to
//do the identification without having to JSON.parse data first.
const RUNE_MESSAGE_PREFIX = "RUNE_MSG;"

export function getRuneGameEvent(event: MessageEvent) {
  return getRuneGameMessage(event, "runeGameEvent") as RuneGameEvent | null
}

export function stringifyRuneGameCommand(data: RuneGameCommand) {
  return stringifyRuneGameMessage({ runeGameCommand: data })
}

export function stringifyRuneGameEvent(data: RuneGameEvent) {
  return stringifyRuneGameMessage({ runeGameEvent: data })
}

export function getRuneGameCommand(event: MessageEvent) {
  return getRuneGameMessage(event, "runeGameCommand") as RuneGameCommand | null
}

export function postRuneEvent(data: RuneGameEvent) {
  //We only expect to send Game events through postMessages
  const event = stringifyRuneGameEvent(data)

  globalThis.ReactNativeWebView
    ? //Post message for Native app
      globalThis.ReactNativeWebView.postMessage(event)
    : //Post message for iframe
      globalThis.parent.postMessage(event, "*")
}

//The message will always only have runeGameEvent or runeGameCommand.
//Using union allows to simplify checks below
type RuneGameMessage = { runeGameEvent?: RuneGameEvent } & {
  runeGameCommand?: RuneGameCommand
}

function stringifyRuneGameMessage(message: RuneGameMessage) {
  //TODO - remove me when all clients are migrated (including native)
  //backwards compatibility to support non scoped events in the native app.
  const messageContent = message.runeGameEvent
    ? message.runeGameEvent
    : message.runeGameCommand

  const runeGameMessage = {
    ...message,
    ...messageContent,
  }

  return `${RUNE_MESSAGE_PREFIX}${JSON.stringify(runeGameMessage)}`
}

function getRuneGameMessage(
  event: MessageEvent,
  key: "runeGameEvent" | "runeGameCommand"
) {
  if (!isRuneGameMessage(event)) {
    return null
  }

  //TODO - remove direct event.data usage when all clients are migrated (including native)
  const message =
    typeof event.data === "string" ? parseRuneMessage(event.data) : event.data

  if (!message[key]) {
    throw new Error(
      `Wrong message received. Expected to find: ${key}, but the message was: ${JSON.stringify(
        message
      )}`
    )
  }

  return message[key]
}

function parseRuneMessage(msg: string): RuneGameMessage {
  return JSON.parse(msg.slice(RUNE_MESSAGE_PREFIX.length))
}

function isRuneGameMessage(
  event: MessageEvent
): event is MessageEvent<string | RuneGameMessage> {
  return typeof event.data === "string" && event.data.startsWith(RUNE_MESSAGE_PREFIX)
}
