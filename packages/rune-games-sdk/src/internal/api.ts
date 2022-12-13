// getRuneGameEvent & stringifyRuneGameCommand are used by the clients to do external communication.
import { getRuneGameMessage, stringifyRuneGameMessage } from "./messageBridge"
import { RuneAppCommand, RuneGameEvent } from "../types"

export function getRuneGameEvent(data: unknown) {
  return getRuneGameMessage<{ runeGameEvent: RuneGameEvent }>(
    data,
    "runeGameEvent"
  )
}

export function stringifyRuneGameCommand(data: RuneAppCommand) {
  return stringifyRuneGameMessage({ runeGameCommand: data })
}

export type { RuneGameEvent, RuneAppCommand }
