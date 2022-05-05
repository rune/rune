import { RuneExport } from "../types";
export declare function messageEventHandler(Rune: RuneExport): (event: MessageEvent) => void;
export declare function setupMessageBridge(Rune: RuneExport): (event: MessageEvent<any>) => void;
