import { RuneGameCommand, RuneGameEvent } from "./types";
export declare function getRuneGameEvent(event: MessageEvent): RuneGameEvent | null;
export declare function stringifyRuneGameCommand(data: RuneGameCommand): string;
export declare function stringifyRuneGameEvent(data: RuneGameEvent): string;
export declare function getRuneGameCommand(event: MessageEvent): RuneGameCommand | null;
export declare function postRuneEvent(data: RuneGameEvent): void;
