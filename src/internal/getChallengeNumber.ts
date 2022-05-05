import { RuneExport } from "../types"

export function getChallengeNumber(Rune: RuneExport) {
  const challengeNumber = +(
    new URLSearchParams(globalThis.location.search).get("challengeNumber") ?? "1"
  )

  if (Number.isInteger(challengeNumber)) {
    Rune._runeChallengeNumber = challengeNumber
  }
}
