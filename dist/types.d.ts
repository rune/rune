export interface InitInput {
    startGame: () => void;
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
    _doneInit: boolean;
    _startGame: () => void;
    _resumeGame: () => void;
    _pauseGame: () => void;
    _requestScore: () => void;
    _getScore: () => number;
    _validateScore: (score: number) => void;
    _randomNumberGenerator: (seed: number) => () => number;
    _hashFromString: (str: string) => number;
    _resetDeterministicRandom: () => void;
    _runeChallengeNumber: number;
}
declare global {
    var Rune: RuneExport | undefined;
    var ReactNativeWebView: {
        postMessage: (data: string) => void;
    } | undefined;
    var runeWindowErrHandler: (event: ErrorEvent) => void | undefined;
    var _runeChallengeNumber: number | undefined;
    var postRuneEvent: ((event: RuneGameEvent) => void) | undefined;
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
export declare type RuneGameCommand = {
    type: "_startGame" | "_resumeGame" | "_pauseGame" | "_requestScore";
};
