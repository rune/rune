declare global {
    var postRuneEvent: ((event: RuneGameEvent) => void) | undefined;
}
interface GameOverInput {
    score: number;
}
interface InitInput {
    startGame: () => void;
    resumeGame: () => void;
    pauseGame: () => void;
}
export declare type RuneGameEvent = {
    type: "INIT";
    version: string;
} | {
    type: "GAME_OVER";
    score: number;
} | {
    type: "ERR";
    errMsg: string;
};
export interface RuneExport {
    version: string;
    _doneInit: boolean;
    gameOver: (input: GameOverInput) => void;
    init: (input: InitInput) => void;
    _startGame: () => void;
    _resumeGame: () => void;
    _pauseGame: () => void;
}
export declare const Rune: RuneExport;
export {};
