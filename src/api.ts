// getRuneGameEvent & stringifyRuneGameCommand are used by the clients to do external communication.
import {
  getRuneGameMessage,
  stringifyRuneGameMessage,
} from "./internal/messageBridge"
import { RuneAppCommand, LegacyRuneGameCommand, RuneGameEvent } from "./types"

export function getRuneGameEvent(data: unknown) {
  return getRuneGameMessage<{ runeGameEvent: RuneGameEvent }>(
    data,
    "runeGameEvent"
  )
}

export function stringifyRuneGameCommand(
  data: RuneAppCommand | LegacyRuneGameCommand
) {
  return stringifyRuneGameMessage({ runeGameCommand: data })
}

export type { RuneGameEvent, RuneAppCommand, LegacyRuneGameCommand }
