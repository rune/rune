"use strict";
/*
The SDK interface for games to interact with Rune.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rune = void 0;
exports.Rune = {
    init: (input) => {
        // Check that game provided correct input to SDK
        const { startGame, resumeGame, pauseGame } = input || {};
        if (typeof startGame !== "function") {
            throw new Error("Invalid startGame function provided to Rune.init()");
        }
        if (typeof resumeGame !== "function") {
            throw new Error("Invalid resumeGame function provided to Rune.init()");
        }
        if (typeof pauseGame !== "function") {
            throw new Error("Invalid pauseGame function provided to Rune.init()");
        }
        // Initialize the SDK with the game's functions
        exports.Rune._startGame = startGame;
        exports.Rune._resumeGame = resumeGame;
        exports.Rune._pauseGame = pauseGame;
        // When running inside Rune, the env RUNE_PLATFORM will always be provided.
        // The gameOver function will be provided by the Rune.
        if (process.env.RUNE_PLATFORM === undefined) {
            // If debugging locally, mimic events and e.g. start a new game after finishing
            exports.Rune.gameOver = function ({ score }) {
                console.log(`RUNE: Successfully communicated score of ${score}.`);
                console.log(`RUNE: Starting new game in 3 seconds.`);
                setTimeout(() => {
                    exports.Rune._startGame();
                    console.log(`RUNE: Started new game.`);
                }, 3000);
            };
            // Mimic the user starting the game by tapping into it
            console.log(`RUNE: Successfully initialized.`);
            console.log(`RUNE: Starting new game in 3 seconds.`);
            setTimeout(() => {
                exports.Rune._startGame();
                console.log(`RUNE: Started new game.`);
            }, 3000);
        }
    },
    // Allow Rune to see which SDK version the game is using
    version: "1.1.1",
    // Make functions throw until init()
    _startGame: () => {
        throw new Error("Rune._startGame() called before Rune.init()");
    },
    _resumeGame: () => {
        throw new Error("Rune._resumeGame() called before Rune.init()");
    },
    _pauseGame: () => {
        throw new Error("Rune._pauseGame() called before Rune.init()");
    },
    gameOver: () => {
        throw new Error("Rune.gameOver() called before Rune.init()");
    },
};
//# sourceMappingURL=index.js.map