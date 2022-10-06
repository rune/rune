import { gql, useMutation } from "@apollo/client/index.js"
import { useCallback } from "react"

import { UpdateAllGamesDocument } from "../generated/types.js"

export function useUpdateAllGames() {
  const [mutate, result] = useMutation(UpdateAllGamesDocument)

  return {
    updateAllGames: useCallback(() => {
      mutate().catch(() => {})
    }, [mutate]),
    updateAllGamesLoading: result.loading,
    updateAllGamesError: result.error,
    updateAllGamesResult: result.data?.updateAllGames,
  }
}

gql`
  mutation UpdateAllGames {
    updateAllGames(input: {}) {
      updatedGameIds
      failedToUpdateGameIds
      errors
    }
  }
`
