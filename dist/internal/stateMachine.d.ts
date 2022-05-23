import { InitInput } from "../types";
export declare type Events = ({
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
};
declare type Context = {
    rng: () => number;
} & InitInput;
export declare type StateMachineService = ReturnType<typeof createStateMachine>;
export declare function createStateMachine(challengeNumber: number): import("xstate").Interpreter<Context, any, ({
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
    context: Context;
}, import("xstate").ResolveTypegenMeta<import("./stateMachine.typegen").Typegen0, ({
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
export {};
