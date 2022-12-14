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
        devTeam {
          id
          handle
        }
        gameVersions(orderBy: [PRIMARY_KEY_DESC]) {
          nodes {
            gameId
            gameVersionId
            status
            supportsChallenge
          }
        }
      }
    }
  }
`

export function gameItemLabel({
  game,
  showDevHandle,
}: {
  game: NonNullable<GamesQuery["games"]>["nodes"][0]
  showDevHandle?: boolean
}) {
  return `${game.title}${
    showDevHandle ? ` [dev: ${game.devTeam?.handle}]` : ""
  }${
    game.gameVersions.nodes[0]
      ? ` (latest version: ${game.gameVersions.nodes[0].status
          .toLowerCase()
          .replace("_", " ")})`
      : " (no versions uploaded)"
  }`
}
