import { RuneExport, InitInput } from "./types";
import { getRuneGameEvent, stringifyRuneGameCommand } from "./messageBridge";
declare const Rune: RuneExport;
export type { RuneExport, InitInput };
export { Rune, getRuneGameEvent, stringifyRuneGameCommand };
