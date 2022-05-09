import { RuneExport } from "../types"

export function setChallengeNumber(Rune: RuneExport, challengeNumberFromParams: number) {
  let challengeNumber = challengeNumberFromParams

  if (Number.isInteger(challengeNumber)) {
    Rune._runeChallengeNumber = challengeNumber
  }
}
