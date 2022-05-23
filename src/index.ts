/*
The SDK interface for games to interact with Rune.
*/
import {
  RuneExport,
  InitInput,
  RuneGameEvent,
  RuneAppCommand,
  LegacyRuneGameCommand,
} from "./types"
import { getRuneGameEvent, stringifyRuneGameCommand } from "./api"
import { validateInput } from "./internal/validations"
import { createStateMachine } from "./internal/stateMachine"

function getRuneSdk(challengeNumber: number) {
  const stateMachineService = createStateMachine(challengeNumber)

  const Rune: RuneExport = {
    version: "1.5.4",
    init: (input) => {
      validateInput(input)

      stateMachineService.send("onGameInit", {
        ...input,
        version: Rune.version,
      })
    },
    getChallengeNumber: () => {
      return challengeNumber
    },
    gameOver: () => {
      stateMachineService.send("onGameOver")
    },
    deterministicRandom: () => {
      return stateMachineService.state.context.rng()
    },
  }

  return {
    Rune,
    stateMachineService,
  }
}

export type {
  RuneExport,
  InitInput,
  RuneGameEvent,
  RuneAppCommand,
  LegacyRuneGameCommand,
}
export { getRuneSdk, getRuneGameEvent, stringifyRuneGameCommand }
