import { createMachine, interpret, assign } from "xstate"
import { randomNumberGenerator } from "./rng"
import { validateScore } from "./validations"
import { postRuneEvent } from "./messageBridge"
import { InitInput } from "../types"

export type Events =
  | ({ type: "onGameInit" } & InitInput & { version: string })
  | { type: "onGameOver" }
  | { type: "onAppPause" }
  | { type: "onAppRestart" }
  | { type: "onAppRequestScore" }
  | { type: "onAppPlay" }
  | { type: "onAppStart (legacy)" }

type Context = {
  rng: () => number
} & InitInput

export type StateMachineService = ReturnType<typeof createStateMachine>

export function createStateMachine(challengeNumber: number) {
  const machine = createMachine(
    {
      tsTypes: {} as import("./stateMachine.typegen").Typegen0,
      schema: {
        context: {} as Context,
        events: {} as Events,
      },

      id: "SDK",
      initial: "LOADING",
      context: {
        rng: randomNumberGenerator(challengeNumber),
        restartGame: () => {},
        resumeGame: () => {},
        getScore: () => 0,
        pauseGame: () => {},
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
    },
    {
      actions: {
        ASSIGN_CALLBACKS: assign(
          (context, { resumeGame, pauseGame, restartGame, getScore }) => {
            return {
              ...context,
              resumeGame,
              pauseGame,
              restartGame,
              getScore,
            }
          }
        ),
        RESET_DETERMINISTIC_RANDOMNESS: assign((context) => ({
          ...context,
          rng: randomNumberGenerator(challengeNumber),
        })),
        CALL_RESUME_GAME: ({ resumeGame }) => {
          resumeGame()
        },
        CALL_PAUSE_GAME: ({ pauseGame }) => {
          pauseGame()
        },
        CALL_RESTART_GAME: ({ restartGame }) => {
          restartGame()
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
        SEND_ERROR: (_, action, meta) => {
          //console.log({ context, action, meta })
          const statePath = (meta.state.history?.toStrings() || []).slice(-1)[0]

          const errorMessage = `Fatal issue: Received ${action.type} while in ${statePath}`

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
  service.start()

  return service
}
