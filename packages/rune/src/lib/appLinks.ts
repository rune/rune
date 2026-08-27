const appOrigin =
  process.env.STAGE === "launchpad"
    ? "https://launchpad.rune.ai"
    : "https://rune.ai"

export function statsLink(gameKey: string) {
  return `${appOrigin}/app/stats/${gameKey}`
}

export function publishLink(gameKey: string) {
  return `${appOrigin}/app/publish/${gameKey}`
}
