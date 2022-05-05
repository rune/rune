// getRuneGameEvent & stringifyRuneGameCommand are exported in index.ts and used by the clients to do external communication.
import { getRuneGameMessage, stringifyRuneGameMessage } from "./internal/messageBridge"
import { RuneGameCommand, RuneGameEvent } from "./types"

export function getRuneGameEvent(data: unknown) {
  return getRuneGameMessage<{ runeGameEvent: RuneGameEvent }>(data, "runeGameEvent")
}

export function stringifyRuneGameCommand(data: RuneGameCommand) {
  return stringifyRuneGameMessage({ runeGameCommand: data })
}
