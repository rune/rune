import { RuneExport, InitInput, RuneGameEvent, RuneAppCommand, LegacyRuneGameCommand } from "./types";
import { getRuneGameEvent, stringifyRuneGameCommand } from "./api";
declare function getRuneSdk(challengeNumber: number): {
    Rune: RuneExport;
    stateMachineService: import("xstate").Interpreter<{
        rng: () => number;
    } & InitInput, any, ({
        type: "onGameInit";
    } & InitInput & {
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
        } & InitInput;
    }, import("xstate").ResolveTypegenMeta<import("./internal/stateMachine.typegen").Typegen0, ({
        type: "onGameInit";
    } & InitInput & {
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
export type { RuneExport, InitInput, RuneGameEvent, RuneAppCommand, LegacyRuneGameCommand, };
export { getRuneSdk, getRuneGameEvent, stringifyRuneGameCommand };
