import { RuneExport, InitInput } from "./types";
import { getRuneGameEvent, stringifyRuneGameCommand } from "./messageBridge";
export type { RuneExport, InitInput };
declare const Rune: RuneExport;
export { Rune, getRuneGameEvent, stringifyRuneGameCommand };
