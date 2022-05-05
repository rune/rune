import { RuneExport } from "../types"

export function getChallengeNumber(Rune: RuneExport) {
  let challengeNumber = 1
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
