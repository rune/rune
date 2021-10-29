"use strict";
/*
The SDK interface for games to interact with Rune.
*/
exports.__esModule = true;
exports.Rune = void 0;
exports.Rune = {
    // External properties and functions
    version: "1.2.2",
    init: function (input) {
        // Check that this function has not already been called
        if (exports.Rune._doneInit) {
            throw new Error("Rune.init() should only be called once");
        }
        exports.Rune._doneInit = true;
        // Check that game provided correct input to SDK
        var _a = input || {}, startGame = _a.startGame, resumeGame = _a.resumeGame, pauseGame = _a.pauseGame;
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
        // When running inside Rune, runePostMessage will always be defined.
        if (globalThis.postRuneEvent) {
            globalThis.postRuneEvent({ type: "INIT", version: exports.Rune.version });
        }
        else {
            mockEvents();
        }
    },
    gameOver: function (_a) {
        var _b;
        var score = _a.score;
        if (!exports.Rune._doneInit) {
            throw new Error("Rune.gameOver() called before Rune.init()");
        }
        if (typeof score !== "number") {
            throw new Error("Score provided to Rune.gameOver() must be a number");
        }
        (_b = globalThis.postRuneEvent) === null || _b === void 0 ? void 0 : _b.call(globalThis, { type: "GAME_OVER", score: score });
    },
    // Internal properties and functions used by the Rune app
    _doneInit: false,
    _startGame: function () {
        throw new Error("Rune._startGame() called before Rune.init()");
    },
    _resumeGame: function () {
        throw new Error("Rune._resumeGame() called before Rune.init()");
    },
    _pauseGame: function () {
        throw new Error("Rune._pauseGame() called before Rune.init()");
    }
};
// Create mock events to support development
var mockEvents = function () {
    // Log posted events to the console (in production, these are processed by Rune)
    globalThis.postRuneEvent = function (event) {
        return console.log("RUNE: Posted " + JSON.stringify(event));
    };
    // Mimic the user tapping Play after 3 seconds
    console.log("RUNE: Starting new game in 3 seconds.");
    setTimeout(function () {
        exports.Rune._startGame();
        console.log("RUNE: Started new game.");
    }, 3000);
    // Automatically restart game 3 seconds after Game Over
    exports.Rune.gameOver = function (_a) {
        var _b;
        var score = _a.score;
        (_b = globalThis.postRuneEvent) === null || _b === void 0 ? void 0 : _b.call(globalThis, { type: "GAME_OVER", score: score });
        console.log("RUNE: Starting new game in 3 seconds.");
        setTimeout(function () {
            exports.Rune._startGame();
            console.log("RUNE: Started new game.");
        }, 3000);
    };
};
//# sourceMappingURL=index.js.map