import { RuneExport, InitInput } from "./types";
import { getRuneGameEvent, stringifyRuneGameCommand } from "./api";
declare function getRuneSdk(): RuneExport;
export type { RuneExport, InitInput };
export { getRuneSdk, getRuneGameEvent, stringifyRuneGameCommand };
