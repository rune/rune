import { useQuery, gql } from "@apollo/client/index.js"
import { useMemo } from "react"

import { GamesDocument, GamesQuery, Me } from "../generated/types.js"

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
  showGameDevs,
  me,
}: {
  game: NonNullable<GamesQuery["games"]>["nodes"][0]
  showGameDevs: boolean
  me: Me
}) {
  const gameDevs = game.gameDevs.nodes
  const gameDevMe = gameDevs.find((gameDev) => gameDev.userId === me.devId)
  const gameDevAdmin = gameDevs.find((gameDev) => gameDev.type === "ADMIN") // only first admin
  const myRole = me.admin ? "ADMIN" : gameDevMe ? gameDevMe.type : "PLAYER"
  const latestVersionStatus = game.gameVersions.nodes[0]?.status ?? "NONE"

  // Prepare label parts
  const gameDevsLabel =
    gameDevs.length === 0
      ? "UNKNOWN"
      : gameDevs.length === 1
      ? gameDevAdmin?.displayName
      : `${gameDevAdmin?.displayName} + ${gameDevs.length - 1} others`

  const gameTitle = game.title
  const tag = showGameDevs ? ` [by ${gameDevsLabel}]` : ""
  const props = [`latestVersion: ${latestVersionStatus}`, `myRole: ${myRole}`]

  return `${gameTitle}${tag} (${props.join(", ")})`
}
