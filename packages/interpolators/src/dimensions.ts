export function getDimensions<Dimensions extends number | number[]>(
  value: Dimensions
): number {
  return Array.isArray(value) ? value.length : -1
}

export function lerp(a: number, b: number, t: number) {
  return (b - a) * t + a
}

export function getPosition<Dimensions extends number | number[]>(
  game: Dimensions | undefined,
  futureGame: Dimensions | undefined,
  size: number | null
) {
  if (game === undefined || futureGame === undefined || size === null) {
    throw new Error(
      "getPosition can't be called before calling update at least once"
    )
  }

  const delta = Rune.timeSinceLastUpdate() / Rune.msPerUpdate

  if (size !== -1) {
    return (game as number[]).map((curr, index) => {
      return lerp(curr, (futureGame as number[])[index], delta)
    }) as Dimensions
  }

  return lerp(game as number, futureGame as number, delta) as Dimensions
}
