import { RuneExport } from "../types";
export declare function messageEventHandler(Rune: RuneExport): (event: MessageEvent) => void;
export declare function setupMessageBridge(Rune: RuneExport, useDocumentForPostMessages: boolean): (event: MessageEvent<any>) => void;
