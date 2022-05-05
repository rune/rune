import { RuneExport, InitInput, RuneGameCommand, RuneGameEvent } from "./types";
import { getRuneGameEvent, stringifyRuneGameCommand } from "./api";
declare function getRuneSdk(): RuneExport;
export type { RuneExport, InitInput, RuneGameEvent, RuneGameCommand };
export { getRuneSdk, getRuneGameEvent, stringifyRuneGameCommand };
