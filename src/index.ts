/*
The SDK interface for games to interact with Rune.
*/
import {
  RuneExport,
  InitInput,
  RuneGameEvent,
  RuneAppCommand,
  LegacyRuneGameCommand,
} from "./types"
import { getRuneGameEvent, stringifyRuneGameCommand } from "./api"

export type {
  RuneExport,
  InitInput,
  RuneGameEvent,
  RuneAppCommand,
  LegacyRuneGameCommand,
}
export { getRuneGameEvent, stringifyRuneGameCommand }
