import { useQuery, gql } from "@apollo/client/index.js"
import { useMemo } from "react"

import { GamesDocument, GamesQuery } from "../generated/types.js"

export function useGames({
  skip,
}: {
  skip?: boolean
} = {}) {
  const { data, ...rest } = useQuery(GamesDocument, {
    skip,
  })

  return {
    games: data?.games?.nodes,
    gamesLoading: rest.loading,
  }
}

gql`
  query Games {
    games(orderBy: [PRIMARY_KEY_DESC]) {
      nodes {
        id
        title
        gameDevs {
          nodes {
            userId
            displayName
            type
          }
        }
        gameVersions(orderBy: [PRIMARY_KEY_DESC]) {
          nodes {
            gameId
            gameVersionId
            status
          }
        }
      }
    }
  }
`

export function useMyGames({
  games,
  devId,
}: {
  games?: NonNullable<GamesQuery["games"]>["nodes"]
  devId?: number
} = {}) {
  const myGames = useMemo(
    () =>
      devId && games
        ? games.filter((game) =>
            game.gameDevs.nodes.some((gameDev) => gameDev.userId === devId)
          )
        : undefined,
    [devId, games]
  )

  return {
    myGames,
  }
}

export function gameItemLabel({
  game,
  showDevDisplayName,
}: {
  game: NonNullable<GamesQuery["games"]>["nodes"][0]
  showDevDisplayName?: boolean
}) {
  const gameDevAdmin = game.gameDevs.nodes.find(
    (gameDev) => gameDev.type === "ADMIN"
  )

  return `${game.title}${
    showDevDisplayName ? ` [dev: ${gameDevAdmin?.displayName}]` : ""
  }${
    game.gameVersions.nodes[0]
      ? ` (latest version: ${game.gameVersions.nodes[0].status
          .toLowerCase()
          .replace("_", " ")})`
      : " (no versions uploaded)"
  }`
}
