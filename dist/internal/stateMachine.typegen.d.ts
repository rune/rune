export interface Typegen0 {
    "@@xstate/typegen": true;
    eventsCausingActions: {
        ASSIGN_CALLBACKS: "onGameInit";
        SEND_INIT: "onGameInit";
        SEND_SCORE: "onAppRequestScore" | "onAppRestart" | "onAppStart (legacy)";
        CALL_PAUSE_GAME: "onAppPause";
        SEND_GAME_OVER: "onGameOver";
        RESET_DETERMINISTIC_RANDOMNESS: "onGameOver" | "onAppRestart" | "onAppStart (legacy)";
        CALL_RESTART_GAME: "onAppRestart" | "onAppStart (legacy)" | "onAppPlay";
        CALL_RESUME_GAME: "onAppPlay" | "onAppStart (legacy)";
        SEND_ERROR: "onGameOver" | "onGameInit";
    };
    internalEvents: {
        "xstate.init": {
            type: "xstate.init";
        };
    };
    invokeSrcNameMap: {};
    missingImplementations: {
        actions: never;
        services: never;
        guards: never;
        delays: never;
    };
    eventsCausingServices: {};
    eventsCausingGuards: {};
    eventsCausingDelays: {};
    matchesStates: "LOADING" | "ERROR" | "INIT" | "INIT.PLAYING" | "INIT.PAUSED" | "INIT.GAME_OVER" | {
        INIT?: "PLAYING" | "PAUSED" | "GAME_OVER";
    };
    tags: never;
}
