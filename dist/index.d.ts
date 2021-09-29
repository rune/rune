interface GameOverInput {
    score: number;
}
interface InitInput {
    startGame: () => void;
    resumeGame: () => void;
    pauseGame: () => void;
}
export interface RuneExport extends InitInput {
    gameOver: (input: GameOverInput) => void;
    init: (input: InitInput) => void;
    version: string;
}
export declare const Rune: RuneExport;
export {};
