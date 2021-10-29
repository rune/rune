/*
The SDK interface for games to interact with Rune.
*/
var Rune = {
    // External properties and functions
    version: "1.2.2",
    init: function (input) {
        // Check that this function has not already been called
        if (Rune._doneInit) {
            throw new Error("Rune.init() should only be called once");
        }
        Rune._doneInit = true;
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
        Rune._startGame = startGame;
        Rune._resumeGame = resumeGame;
        Rune._pauseGame = pauseGame;
        // When running inside Rune, runePostMessage will always be defined.
        if (window.postRuneEvent) {
            window.postRuneEvent({ type: "INIT", version: Rune.version });
        }
        else {
            mockEvents();
        }
    },
    gameOver: function (_a) {
        var _b;
        var score = _a.score;
        if (!Rune._doneInit) {
            throw new Error("Rune.gameOver() called before Rune.init()");
        }
        if (typeof score !== "number") {
            throw new Error("Score provided to Rune.gameOver() must be a number");
        }
        (_b = window.postRuneEvent) === null || _b === void 0 ? void 0 : _b.call(window, { type: "GAME_OVER", score: score });
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
    window.postRuneEvent = function (event) {
        return console.log("RUNE: Posted " + JSON.stringify(event));
    };
    // Mimic the user tapping Play after 3 seconds
    console.log("RUNE: Starting new game in 3 seconds.");
    setTimeout(function () {
        Rune._startGame();
        console.log("RUNE: Started new game.");
    }, 3000);
    // Automatically restart game 3 seconds after Game Over
    Rune.gameOver = function (_a) {
        var _b;
        var score = _a.score;
        (_b = window.postRuneEvent) === null || _b === void 0 ? void 0 : _b.call(window, { type: "GAME_OVER", score: score });
        console.log("RUNE: Starting new game in 3 seconds.");
        setTimeout(function () {
            Rune._startGame();
            console.log("RUNE: Started new game.");
        }, 3000);
    };
};
