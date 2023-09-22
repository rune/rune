import { useQuery, gql } from "@apollo/client/index.js"

import { GamesDocument, GameCondition, GamesQuery } from "../generated/types.js"

export function useGames({
  skip,
  condition,
}: {
  skip?: boolean
  condition?: GameCondition
} = {}) {
  const { data, ...rest } = useQuery(GamesDocument, {
    skip,
    variables: { condition },
  })

  return {
    games: data?.games?.nodes,
    gamesLoading: rest.loading,
  }
}

gql`
  query Games($condition: GameCondition) {
    games(condition: $condition, orderBy: [PRIMARY_KEY_DESC]) {
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
