import { useMutation, gql } from "@apollo/client/index.js"
import { useCallback } from "react"

import {
  CreateGameVersionDocument,
  CreateGameVersionMutationVariables,
} from "../generated/types.js"

export function useCreateGameVersion() {
  const [mutate, result] = useMutation(CreateGameVersionDocument)

  return {
    createGameVersion: useCallback(
      (variables: CreateGameVersionMutationVariables) => {
        mutate({ variables }).catch(() => {})
      },
      [mutate]
    ),
    createGameVersionLoading: result.loading,
    createGameVersionError: result.error,
    newGameVersionId: result.data?.createGameVersion.gameVersion.gameVersionId,
    previewLink: result.data?.createGameVersion.previewLink,
  }
}

gql`
  mutation CreateGameVersion(
    $gameId: Int!
    $content: Upload!
    $challengeSupport: Boolean
  ) {
    createGameVersion(
      input: {
        gameId: $gameId
        content: $content
        challengeSupport: $challengeSupport
      }
    ) {
      previewLink
      gameVersion {
        gameId
        gameVersionId
      }
    }
  }
`
