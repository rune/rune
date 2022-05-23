import { createMachine, assign, interpret } from 'xstate';

//The native app only support strings for post message communication.
//To identify if received message is used by Rune, we are prefixing all of them with RUNE_MESSAGE_PREFIX. This allows to
//do the identification without having to JSON.parse data first.
const RUNE_MESSAGE_PREFIX = "RUNE_MSG;";
function stringifyRuneGameEvent(data) {
    return stringifyRuneGameMessage({ runeGameEvent: data });
}
function postRuneEvent(data) {
    //We only expect to send Game events through postMessages
    const event = stringifyRuneGameEvent(data);
    //Post message for Native app
    if (globalThis.ReactNativeWebView) {
        globalThis.ReactNativeWebView.postMessage(event);
        return;
    }
    //Game is not running in iframe, don't try to send a message and notify user
    if (globalThis.parent === globalThis) {
        console.error("Rune SDK has to run in a container");
        return;
    }
    //Post message for iframe
    globalThis.parent.postMessage(event, "*");
}
function stringifyRuneGameMessage(message) {
    return `${RUNE_MESSAGE_PREFIX}${JSON.stringify(message)}`;
}
function getRuneGameMessage(data, key) {
    if (!isRuneGameMessage(data)) {
        return null;
    }
    const message = parseRuneMessage(data);
    if (!message[key]) {
        throw new Error(`Wrong message received. Expected to find: ${key}, but the message was: ${JSON.stringify(message)}`);
    }
    return message[key];
}
function parseRuneMessage(msg) {
    return JSON.parse(msg.slice(RUNE_MESSAGE_PREFIX.length));
}
function isRuneGameMessage(data) {
    return typeof data === "string" && data.startsWith(RUNE_MESSAGE_PREFIX);
}

// getRuneGameEvent & stringifyRuneGameCommand are exported in index.ts and used by the clients to do external communication.
function getRuneGameEvent(data) {
    return getRuneGameMessage(data, "runeGameEvent");
}
function stringifyRuneGameCommand(data) {
    return stringifyRuneGameMessage({ runeGameCommand: data });
}

function validateScore(score) {
    if (typeof score !== "number") {
        throw new Error(`Score is not a number. Received: ${typeof score}`);
    }
    if (score < 0 || score > Math.pow(10, 9)) {
        throw new Error(`Score is not between 0 and 1000000000. Received: ${score}`);
    }
    if (!Number.isInteger(score)) {
        throw new Error(`Score is not an integer. Received: ${score}`);
    }
}
function validateInput({ restartGame, resumeGame, pauseGame, getScore, } = {}) {
    if (typeof resumeGame !== "function") {
        throw new Error("Invalid resumeGame function provided to Rune.init()");
    }
    if (typeof pauseGame !== "function") {
        throw new Error("Invalid pauseGame function provided to Rune.init()");
    }
    if (typeof getScore !== "function") {
        throw new Error("Invalid getScore function provided to Rune.init()");
    }
    if (typeof restartGame !== "function") {
        throw new Error("Invalid restartGame function provided to Rune.init()");
    }
    validateScore(getScore());
}

// A pseudorandom number generator (PRNG) for determinism.
// Based on the efficient mulberry32 with 32-bit state.
// From https://github.com/bryc/code/blob/master/jshash/PRNGs.md.
function randomNumberGenerator(seed) {
    // Initialize using hash function to avoid seed quality issues.
    // E.g. to avoid correlations between using 1 and 2 as seed.
    let hash = hashFromString(seed.toString());
    return function () {
        let t = (hash += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
// xmur3 from https://github.com/bryc/code/blob/master/jshash/PRNGs.md.
// Returns a number as opposed to seed() function for ease of use.
function hashFromString(str) {
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
}

function createStateMachine(challengeNumber) {
    const machine = createMachine({
        tsTypes: {},
        schema: {
            context: {},
            events: {},
        },
        id: "SDK",
        initial: "LOADING",
        context: {
            rng: randomNumberGenerator(challengeNumber),
            restartGame: () => { },
            resumeGame: () => { },
            getScore: () => 0,
            pauseGame: () => { },
        },
        states: {
            LOADING: {
                on: {
                    onGameInit: {
                        actions: ["ASSIGN_CALLBACKS", "SEND_INIT"],
                        target: "INIT",
                    },
                    onGameOver: {
                        target: "ERROR",
                    },
                },
            },
            ERROR: {
                type: "final",
                entry: "SEND_ERROR",
            },
            INIT: {
                initial: "PAUSED",
                states: {
                    PLAYING: {
                        on: {
                            onAppPause: {
                                actions: "CALL_PAUSE_GAME",
                                target: "PAUSED",
                            },
                            onGameOver: {
                                actions: ["SEND_GAME_OVER", "RESET_DETERMINISTIC_RANDOMNESS"],
                                target: "GAME_OVER",
                            },
                            onAppRestart: {
                                actions: [
                                    "SEND_SCORE",
                                    "RESET_DETERMINISTIC_RANDOMNESS",
                                    "CALL_RESTART_GAME",
                                ],
                            },
                            "onAppStart (legacy)": {
                                actions: [
                                    "SEND_SCORE",
                                    "RESET_DETERMINISTIC_RANDOMNESS",
                                    "CALL_RESTART_GAME",
                                ],
                            },
                        },
                    },
                    PAUSED: {
                        on: {
                            onAppPlay: {
                                actions: "CALL_RESUME_GAME",
                                target: "PLAYING",
                            },
                            onGameOver: {
                                target: "#SDK.ERROR",
                            },
                            "onAppStart (legacy)": {
                                actions: "CALL_RESUME_GAME",
                                target: "PLAYING",
                            },
                        },
                    },
                    GAME_OVER: {
                        on: {
                            onAppPlay: {
                                actions: "CALL_RESTART_GAME",
                                target: "PLAYING",
                            },
                            onGameOver: {
                                target: "#SDK.ERROR",
                            },
                            "onAppStart (legacy)": {
                                actions: "CALL_RESTART_GAME",
                                target: "PLAYING",
                            },
                        },
                    },
                },
                on: {
                    onAppRequestScore: {
                        actions: "SEND_SCORE",
                    },
                    onGameInit: {
                        target: "ERROR",
                    },
                },
            },
        },
    }, {
        actions: {
            ASSIGN_CALLBACKS: assign((context, { resumeGame, pauseGame, restartGame, getScore }) => {
                return {
                    ...context,
                    resumeGame,
                    pauseGame,
                    restartGame,
                    getScore,
                };
            }),
            RESET_DETERMINISTIC_RANDOMNESS: assign((context) => ({
                ...context,
                rng: randomNumberGenerator(challengeNumber),
            })),
            CALL_RESUME_GAME: ({ resumeGame }) => {
                resumeGame();
            },
            CALL_PAUSE_GAME: ({ pauseGame }) => {
                pauseGame();
            },
            CALL_RESTART_GAME: ({ restartGame }) => {
                restartGame();
            },
            SEND_SCORE: ({ getScore }) => {
                const score = getScore();
                validateScore(score);
                postRuneEvent({
                    type: "SCORE",
                    score,
                    challengeNumber,
                });
            },
            SEND_INIT: (_, { version }) => {
                postRuneEvent({ type: "INIT", version });
            },
            SEND_ERROR: () => {
                postRuneEvent({
                    type: "ERR",
                    errMsg: "TODO",
                });
            },
            SEND_GAME_OVER: ({ getScore }) => {
                const score = getScore();
                validateScore(score);
                postRuneEvent({
                    type: "GAME_OVER",
                    score,
                    challengeNumber,
                });
            },
        },
    });
    const service = interpret(machine);
    service.start();
    return service;
}

function getRuneSdk(challengeNumber) {
    const stateMachineService = createStateMachine(challengeNumber);
    const Rune = {
        version: "1.5.4",
        init: (input) => {
            validateInput(input);
            stateMachineService.send("onGameInit", {
                ...input,
                version: Rune.version,
            });
        },
        getChallengeNumber: () => {
            return challengeNumber;
        },
        gameOver: () => {
            stateMachineService.send("onGameOver");
        },
        deterministicRandom: () => {
            return stateMachineService.state.context.rng();
        },
    };
    return {
        Rune,
        stateMachineService,
    };
}

export { getRuneGameEvent, getRuneSdk, stringifyRuneGameCommand };
//# sourceMappingURL=index.js.map
