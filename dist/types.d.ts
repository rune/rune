export interface InitInput {
    restartGame: () => void;
    resumeGame: () => void;
    pauseGame: () => void;
    getScore: () => number;
}
export interface RuneExport {
    version: string;
    init: (input: InitInput) => void;
    gameOver: () => void;
    getChallengeNumber: () => number;
    deterministicRandom: () => number;
}
declare global {
    var ReactNativeWebView: {
        postMessage: (data: string) => void;
    } | undefined;
}
export declare type RuneGameEvent = {
    type: "INIT";
    version: string;
} | {
    type: "GAME_OVER";
    score: number;
    challengeNumber: number;
} | {
    type: "ERR";
    errMsg: string;
} | {
    type: "WINDOW_ERR";
    err: {
        msg: string;
        filename: string;
        lineno: number;
        colno: number;
    };
} | {
    type: "SCORE";
    score: number;
    challengeNumber: number;
} | {
    type: "BROWSER_INITIAL_OVERLAY_CLICKED";
} | {
    type: "BROWSER_IFRAME_LOADED";
};
export declare type LegacyRuneGameCommand = {
    type: "_startGame" | "_resumeGame" | "_pauseGame" | "_requestScore";
};
export declare type RuneAppCommand = {
    type: "restartGame" | "playGame" | "pauseGame" | "requestScore";
};
