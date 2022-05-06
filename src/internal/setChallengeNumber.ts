import { RuneExport } from "../types"

export function setChallengeNumber(Rune: RuneExport, challengeNumberFromParams: number) {
  let challengeNumber = challengeNumberFromParams
  // TODO remove _runeChallengeNumber usage when native app is migrated
  if (globalThis._runeChallengeNumber) {
    challengeNumber = globalThis._runeChallengeNumber
  }

  if (Number.isInteger(challengeNumber)) {
    Rune._runeChallengeNumber = challengeNumber
  }
}
