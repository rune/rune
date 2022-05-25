import { createMachine, interpret, assign } from "xstate"
import { randomNumberGenerator } from "./rng"
import { validateScore } from "./validations"
import { postRuneEvent } from "./messageBridge"
import { InitInput } from "../types"

export type Events =
  | ({ type: "onGameInit" } & InitInput & {
        version: string
      })
  | { type: "onGameOver" }
  | { type: "onAppPause" }
  | { type: "onAppRestart" }
  | { type: "onAppRequestScore" }
  | { type: "onAppPlay" }
  | { type: "onAppStart (legacy)" }

type Context = {
  rng: () => number
  legacyGameStarted: boolean
} & InitInput

export type StateMachineService = ReturnType<typeof createStateMachine>

// Link to state machine - https://stately.ai/registry/editor/share/ced5de88-385e-44f3-938f-ffa38580b774
export function createStateMachine(challengeNumber: number) {
  const machine = createMachine(
    {
      tsTypes: {} as import("./stateMachine.typegen").Typegen0,
      preserveActionOrder: true, // Ensures that assign actions are called in order (see https://xstate.js.org/docs/guides/context.html#action-order)
      schema: {
        context: {} as Context,
        events: {} as Events,
      },

      context: {
        rng: randomNumberGenerator(challengeNumber),
        restartGame: () => {
          throw new Error("restartGame is not initialized!")
        },
        resumeGame: () => {
          throw new Error("resumeGame is not initialized!")
        },
        getScore: () => {
          throw new Error("getScore is not initialized!")
        },
        pauseGame: () => {
          throw new Error("pauseGame is not initialized!")
        },
        legacyGameStarted: false,
      },

      id: "SDK",
      initial: "LOADING",
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
              entry: "ASSIGN_LEGACY_GAME_STARTED",
              on: {
                onAppPause: {
                  actions: "CALL_PAUSE_GAME",
                  target: "PAUSED",
                },
                onGameOver: {
                  actions: [
                    "SEND_GAME_OVER",
                    "RESET_DETERMINISTIC_RANDOMNESS",
                    "ASSIGN_LEGACY_GAME_ENDED",
                  ],
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
    },
    {
      actions: {
        ASSIGN_CALLBACKS: assign((context, initParams) => {
          return {
            ...context,
            ...initParams,
          }
        }),
        RESET_DETERMINISTIC_RANDOMNESS: assign((context) => ({
          ...context,
          rng: randomNumberGenerator(challengeNumber),
        })),
        ASSIGN_LEGACY_GAME_STARTED: assign((context) => ({
          ...context,
          legacyGameStarted: true,
        })),
        ASSIGN_LEGACY_GAME_ENDED: assign((context) => ({
          ...context,
          legacyGameStarted: false,
        })),
        CALL_RESUME_GAME: ({ resumeGame, startGame, legacyGameStarted }) => {
          startGame && !legacyGameStarted ? startGame() : resumeGame()
        },
        CALL_PAUSE_GAME: ({ pauseGame }) => {
          pauseGame()
        },
        CALL_RESTART_GAME: ({ restartGame, startGame }) => {
          startGame ? startGame() : restartGame()
        },

        SEND_SCORE: ({ getScore }) => {
          const score = getScore()

          validateScore(score)

          postRuneEvent({
            type: "SCORE",
            score,
            challengeNumber,
          })
        },
        SEND_INIT: (_, { version }) => {
          postRuneEvent({ type: "INIT", version })
        },
        SEND_ERROR: (_, event, meta) => {
          const statePath = (meta.state.history?.toStrings() || []).slice(-1)[0]

          const errorMessage = `Fatal issue: Received ${event.type} while in ${statePath}`

          postRuneEvent({
            type: "ERR",
            errMsg: errorMessage,
          })
        },
        SEND_GAME_OVER: ({ getScore }) => {
          const score = getScore()

          validateScore(score)

          postRuneEvent({
            type: "GAME_OVER",
            score,
            challengeNumber,
          })
        },
      },
    }
  )

  const service = interpret(machine)

  service.onTransition((state, event) => {
    // As soon as state machine is initialized, it calls onTransition, but the state.changed is undefined (see https://xstate.js.org/docs/guides/states.html#state-changed)
    if (state.changed === undefined) {
      return
    }

    // If nothing has changed inside the state machine (state/context) that means that the event was not handled.
    if (!state.changed) {
      const statePath = (state.toStrings() || []).slice(-1)[0]

      const msg = `Received ${event.type} while in ${statePath}`
      postRuneEvent({
        type: "WARNING",
        msg,
      })
    }
  })

  service.start()

  return service
}
