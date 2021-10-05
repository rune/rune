interface GameOverInput {
    score: number;
}
interface InitInput {
    startGame: () => void;
    resumeGame: () => void;
    pauseGame: () => void;
}
export interface RuneExport {
    version: string;
    gameOver: (input: GameOverInput) => void;
    init: (input: InitInput) => void;
    _startGame: () => void;
    _resumeGame: () => void;
    _pauseGame: () => void;
}
export declare const Rune: RuneExport;
export {};
