import { RuneExport } from "./types";
export declare function getRuneSdk(challengeNumber: number): {
    Rune: RuneExport;
    stateMachineService: import("xstate").Interpreter<{
        rng: () => number;
    } & import("./types").InitInput, any, ({
        type: "onGameInit";
    } & import("./types").InitInput & {
        version: string;
    }) | {
        type: "onGameOver";
    } | {
        type: "onAppPause";
    } | {
        type: "onAppRestart";
    } | {
        type: "onAppRequestScore";
    } | {
        type: "onAppPlay";
    } | {
        type: "onAppStart (legacy)";
    }, {
        value: any;
        context: {
            rng: () => number;
        } & import("./types").InitInput;
    }, import("xstate").ResolveTypegenMeta<import("./internal/stateMachine.typegen").Typegen0, ({
        type: "onGameInit";
    } & import("./types").InitInput & {
        version: string;
    }) | {
        type: "onGameOver";
    } | {
        type: "onAppPause";
    } | {
        type: "onAppRestart";
    } | {
        type: "onAppRequestScore";
    } | {
        type: "onAppPlay";
    } | {
        type: "onAppStart (legacy)";
    }, import("xstate").BaseActionObject, import("xstate").ServiceMap>>;
};
