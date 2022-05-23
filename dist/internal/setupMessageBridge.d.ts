import { StateMachineService } from "./stateMachine";
export declare function messageEventHandler(stateMachineService: StateMachineService): (event: MessageEvent) => import("xstate").State<{
    rng: () => number;
} & import("..").InitInput, ({
    type: "onGameInit";
} & import("..").InitInput & {
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
}, any, {
    value: any;
    context: {
        rng: () => number;
    } & import("..").InitInput;
}, import("xstate").ResolveTypegenMeta<import("./stateMachine.typegen").Typegen0, ({
    type: "onGameInit";
} & import("..").InitInput & {
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
}, import("xstate").BaseActionObject, import("xstate").ServiceMap>> | undefined;
export declare function setupMessageBridge(stateMachineService: StateMachineService, useDocumentForPostMessages: boolean): (event: MessageEvent<any>) => import("xstate").State<{
    rng: () => number;
} & import("..").InitInput, ({
    type: "onGameInit";
} & import("..").InitInput & {
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
}, any, {
    value: any;
    context: {
        rng: () => number;
    } & import("..").InitInput;
}, import("xstate").ResolveTypegenMeta<import("./stateMachine.typegen").Typegen0, ({
    type: "onGameInit";
} & import("..").InitInput & {
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
}, import("xstate").BaseActionObject, import("xstate").ServiceMap>> | undefined;
