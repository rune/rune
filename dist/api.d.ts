import { RuneAppCommand, LegacyRuneGameCommand, RuneGameEvent } from "./types";
export declare function getRuneGameEvent(data: unknown): RuneGameEvent | null;
export declare function stringifyRuneGameCommand(data: RuneAppCommand | LegacyRuneGameCommand): string;
