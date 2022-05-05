//The native app only support strings for post message communication.
//To identify if received message is used by Rune, we are prefixing all of them with RUNE_MESSAGE_PREFIX. This allows to
//do the identification without having to JSON.parse data first.
const RUNE_MESSAGE_PREFIX = "RUNE_MSG;";
// getRuneGameEvent & stringifyRuneGameCommand are exported in index.ts and used by the clients to do external communication.
function getRuneGameEvent(event) {
    return getRuneGameMessage(event, "runeGameEvent");
}
function stringifyRuneGameCommand(data) {
    return stringifyRuneGameMessage({ runeGameCommand: data });
}
function stringifyRuneGameEvent(data) {
    return stringifyRuneGameMessage({ runeGameEvent: data });
}
function postRuneEvent(data) {
    //TODO remove when all legacy native clients are migrated
    if (globalThis.postRuneEvent) {
        globalThis.postRuneEvent(data);
        return;
    }
    //We only expect to send Game events through postMessages
    const event = stringifyRuneGameEvent(data);
    //Post message for Native app
    if (globalThis.ReactNativeWebView) {
        globalThis.ReactNativeWebView.postMessage(event);
        return;
    }
    //Game is not running in iframe, don't try to send a message and notify user
    if (globalThis.parent === globalThis) {
        console.error("Rune SDK is supposed to run in a container");
        return;
    }
    //Post message for iframe
    globalThis.parent.postMessage(event, "*");
}
function stringifyRuneGameMessage(message) {
    return `${RUNE_MESSAGE_PREFIX}${JSON.stringify(message)}`;
}
function getRuneGameMessage(event, key) {
    if (!isRuneGameMessage(event)) {
        return null;
    }
    const message = parseRuneMessage(event.data);
    if (!message[key]) {
        throw new Error(`Wrong message received. Expected to find: ${key}, but the message was: ${JSON.stringify(message)}`);
    }
    return message[key];
}
function parseRuneMessage(msg) {
    return JSON.parse(msg.slice(RUNE_MESSAGE_PREFIX.length));
}
function isRuneGameMessage(event) {
    return typeof event.data === "string" && event.data.startsWith(RUNE_MESSAGE_PREFIX);
}

function getRuneSdk() {
    let doneFirstPlay = false;
    const Rune = {
        // External properties and functions
        version: "1.5.0",
        init: (input) => {
            // Check that this function has not already been called
            if (Rune._doneInit) {
                throw new Error("Rune.init() should only be called once");
            }
            Rune._doneInit = true;
            // Check that game provided correct input to SDK
            const { startGame, resumeGame, pauseGame, getScore } = input || {};
            if (typeof startGame !== "function") {
                throw new Error("Invalid startGame function provided to Rune.init()");
            }
            if (typeof resumeGame !== "function") {
                throw new Error("Invalid resumeGame function provided to Rune.init()");
            }
            if (typeof pauseGame !== "function") {
                throw new Error("Invalid pauseGame function provided to Rune.init()");
            }
            if (typeof getScore !== "function") {
                throw new Error("Invalid getScore function provided to Rune.init()");
            }
            Rune._validateScore(getScore());
            // Initialize the SDK with the game's functions
            Rune._startGame = () => {
                //Restart the random function starting from the 2nd time the game is started (due to restart/game over)
                if (doneFirstPlay) {
                    Rune._resetDeterministicRandom();
                }
                doneFirstPlay = true;
                return startGame();
            };
            Rune._resumeGame = resumeGame;
            Rune._pauseGame = pauseGame;
            Rune._getScore = getScore;
            // When running inside Rune, runePostMessage will always be defined.
            postRuneEvent({ type: "INIT", version: Rune.version });
        },
        gameOver: () => {
            if (!Rune._doneInit) {
                throw new Error("Rune.gameOver() called before Rune.init()");
            }
            const score = Rune._getScore();
            Rune._validateScore(score);
            postRuneEvent({
                type: "GAME_OVER",
                score,
                challengeNumber: Rune.getChallengeNumber(),
            });
        },
        getChallengeNumber: () => Rune._runeChallengeNumber ?? 1,
        deterministicRandom: () => {
            // The first time that this method is called, replace it with our
            // deterministic random number generator and return the first number.
            Rune._resetDeterministicRandom();
            return Rune.deterministicRandom();
        },
        // Internal properties and functions used by the Rune app
        _doneInit: false,
        _requestScore: () => {
            const score = Rune._getScore();
            Rune._validateScore(score);
            postRuneEvent({
                type: "SCORE",
                score,
                challengeNumber: Rune.getChallengeNumber(),
            });
        },
        _startGame: () => {
            throw new Error("Rune._startGame() called before Rune.init()");
        },
        _resumeGame: () => {
            throw new Error("Rune._resumeGame() called before Rune.init()");
        },
        _pauseGame: () => {
            throw new Error("Rune._pauseGame() called before Rune.init()");
        },
        _getScore: () => {
            throw new Error("Rune._getScore() called before Rune.init()");
        },
        _validateScore: (score) => {
            if (typeof score !== "number") {
                throw new Error(`Score is not a number. Received: ${typeof score}`);
            }
            if (score < 0 || score > Math.pow(10, 9)) {
                throw new Error(`Score is not between 0 and 1000000000. Received: ${score}`);
            }
            if (!Number.isInteger(score)) {
                throw new Error(`Score is not an integer. Received: ${score}`);
            }
        },
        // A pseudorandom number generator (PRNG) for determinism.
        // Based on the efficient mulberry32 with 32-bit state.
        // From https://github.com/bryc/code/blob/master/jshash/PRNGs.md.
        _randomNumberGenerator: (seed) => {
            // Initialize using hash function to avoid seed quality issues.
            // E.g. to avoid correlations between using 1 and 2 as seed.
            let hash = Rune._hashFromString(seed.toString());
            return function () {
                let t = (hash += 0x6d2b79f5);
                t = Math.imul(t ^ (t >>> 15), t | 1);
                t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
                return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
            };
        },
        // xmur3 from https://github.com/bryc/code/blob/master/jshash/PRNGs.md.
        // Returns a number as opposed to seed() function for ease of use.
        _hashFromString: (str) => {
            for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++) {
                h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
                h = (h << 13) | (h >>> 19);
            }
            const seed = () => {
                h = Math.imul(h ^ (h >>> 16), 2246822507);
                h = Math.imul(h ^ (h >>> 13), 3266489909);
                return (h ^= h >>> 16) >>> 0;
            };
            return seed();
        },
        _resetDeterministicRandom: () => {
            // Reset randomness to be deterministic across plays
            Rune.deterministicRandom = Rune._randomNumberGenerator(Rune.getChallengeNumber());
        },
        _runeChallengeNumber: 1,
    };
    return Rune;
}

export { getRuneGameEvent, getRuneSdk, stringifyRuneGameCommand };
//# sourceMappingURL=index.js.map
