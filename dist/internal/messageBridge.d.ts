import { RuneGameCommand, RuneGameEvent } from "../types";
export declare function stringifyRuneGameEvent(data: RuneGameEvent): string;
export declare function getRuneGameCommand(data: unknown): RuneGameCommand | null;
export declare function postRuneEvent(data: RuneGameEvent): void;
export declare function stringifyRuneGameMessage<T>(message: T): string;
export declare function getRuneGameMessage<MessageType>(data: unknown, key: keyof MessageType): MessageType[keyof MessageType] | null;
