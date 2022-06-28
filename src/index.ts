/*
The SDK interface for games to interact with Rune.
*/
import { RuneExport, InitInput } from "./types"
import { createStateMachine } from "./internal/stateMachine"
import { validateInput } from "./internal/validations"

export function getRuneSdk({ challengeNumber }: { challengeNumber: number }) {
  const stateMachineService = createStateMachine(challengeNumber)

  const Rune: RuneExport = {
    version: "2.2.3",
    init: (input) => {
      if (input.getScore.canNotReturn) {
        const originalGetScore = input.getScore

        input.getScore = () => {
          originalGetScore()
          return originalGetScore.score
        }
      }

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

export type { RuneExport, InitInput }
