export function getChallengeNumber() {
  const challengeNumber = +(
    new URLSearchParams(globalThis.location.search).get("challengeNumber") ?? "1"
  )

  if (Number.isInteger(challengeNumber)) {
    globalThis._runeChallengeNumber = challengeNumber
  }
}
