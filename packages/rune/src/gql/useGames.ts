import { useQuery, gql } from "@apollo/client/index.js"

import { GamesDocument } from "../generated/types.js"

export function useGames({
  skip,
  includeRuneGames,
}: {
  skip?: boolean
  includeRuneGames?: boolean
} = {}) {
  const { data, ...rest } = useQuery(GamesDocument, {
    skip,
    variables: { includeRuneGames },
  })

  return {
    games: data?.games?.nodes,
    gamesLoading: rest.loading,
    gamesError: rest.error,
  }
}

gql`
  query Games($includeRuneGames: Boolean) {
    games(includeRuneGames: $includeRuneGames) {
      nodes {
        id
        key
        title
        isRuneGame
        canUpload
        description
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
