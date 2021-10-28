/*
The SDK interface for games to interact with Rune.
*/
window["Rune"] = {
    // External properties and functions
    version: "1.2.0",
    init: (input) => {
        // Check that this function has not already been called
        if (Rune._doneInit) {
            throw new Error("Rune.init() should only be called once");
        }
        Rune._doneInit = true;
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
        Rune._startGame = startGame;
        Rune._resumeGame = resumeGame;
        Rune._pauseGame = pauseGame;
        // When running inside Rune, runePostMessage will always be defined.
        if (globalThis.postRuneEvent) {
            globalThis.postRuneEvent({ type: "INIT", version: Rune.version });
        }
        else {
            mockEvents();
        }
    },
    gameOver: ({ score }) => {
        var _a;
        if (!Rune._doneInit) {
            throw new Error("Rune.gameOver() called before Rune.init()");
        }
        if (typeof score !== "number") {
            throw new Error("Score provided to Rune.gameOver() must be a number");
        }
        (_a = globalThis.postRuneEvent) === null || _a === void 0 ? void 0 : _a.call(globalThis, { type: "GAME_OVER", score });
    },
    // Internal properties and functions used by the Rune app
    _doneInit: false,
    _startGame: () => {
        throw new Error("Rune._startGame() called before Rune.init()");
    },
    _resumeGame: () => {
        throw new Error("Rune._resumeGame() called before Rune.init()");
    },
    _pauseGame: () => {
        throw new Error("Rune._pauseGame() called before Rune.init()");
    },
};
// Create mock events to support development
const mockEvents = () => {
    // Log posted events to the console (in production, these are processed by Rune)
    globalThis.postRuneEvent = (event) => console.log(`RUNE: Posted ${JSON.stringify(event)}`);
    // Mimic the user tapping Play after 3 seconds
    console.log(`RUNE: Starting new game in 3 seconds.`);
    setTimeout(() => {
        Rune._startGame();
        console.log(`RUNE: Started new game.`);
    }, 3000);
    // Automatically restart game 3 seconds after Game Over
    Rune.gameOver = function ({ score }) {
        var _a;
        (_a = globalThis.postRuneEvent) === null || _a === void 0 ? void 0 : _a.call(globalThis, { type: "GAME_OVER", score });
        console.log(`RUNE: Starting new game in 3 seconds.`);
        setTimeout(() => {
            Rune._startGame();
            console.log(`RUNE: Started new game.`);
        }, 3000);
    };
};
