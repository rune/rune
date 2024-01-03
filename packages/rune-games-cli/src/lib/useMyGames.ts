import { useMemo } from "react"

import { GamesQuery } from "../generated/types.js"

export function useMyGames({
  games,
  devId,
}: {
  games?: NonNullable<GamesQuery["games"]>["nodes"]
  devId?: number
} = {}) {
  const groupedGames = useMemo(() => {
    if (!devId || !games) {
      return { myGames: undefined, otherGames: undefined }
    }

    const sortedGames = [...games].sort((g1, g2) =>
      g1.title.localeCompare(g2.title)
    )

    const myGames = []
    const otherGames = []

    for (const game of sortedGames) {
      if (game.gameDevs.nodes.some((gameDev) => gameDev.userId === devId)) {
        myGames.push(game)
      } else {
        otherGames.push(game)
      }
    }

    return { myGames, otherGames }
  }, [devId, games])

  return groupedGames
}
