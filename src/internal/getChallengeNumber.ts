import { RuneExport } from "../types"

export function getChallengeNumber(Rune: RuneExport) {
  let challengeNumber = 1
  // TODO remove _runeChallengeNumber usage when native app is migrated
  if (globalThis._runeChallengeNumber) {
    challengeNumber = globalThis._runeChallengeNumber
  } else {
    challengeNumber = +(
      new URLSearchParams(globalThis.location.search).get("challengeNumber") ?? "1"
    )
  }

  if (Number.isInteger(challengeNumber)) {
    Rune._runeChallengeNumber = challengeNumber
  }
}
