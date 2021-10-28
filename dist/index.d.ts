declare global {
    var postRuneEvent: ((event: RuneGameEvent) => void) | undefined;
}
interface InitInput {
    startGame: () => void;
    resumeGame: () => void;
    pauseGame: () => void;
    getScore: () => number;
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
} | {
    type: "SCORE";
    score: number;
};
export interface RuneExport {
    version: string;
    gameOver: () => void;
    init: (input: InitInput) => void;
    _doneInit: boolean;
    _startGame: () => void;
    _resumeGame: () => void;
    _pauseGame: () => void;
    _getScore: () => void;
    _getScoreFromGame: () => number;
}
export declare const Rune: RuneExport;
export {};
