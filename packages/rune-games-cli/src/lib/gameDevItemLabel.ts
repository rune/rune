import { GameQuery } from "../generated/types.js"

export function gameDevItemLabel({
  gameDev,
}: {
  gameDev: NonNullable<GameQuery["gameById"]>["gameDevs"]["nodes"][0]
}) {
  return `${gameDev.displayName} (role: ${gameDev.type})`
}
