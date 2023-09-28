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
    gameVersionId: result.data?.createGameVersion.gameVersion.gameVersionId,
    previewLink: result.data?.createGameVersion.previewLink,
    congratulationMsg: result?.data?.createGameVersion.congratulationMsg,
  }
}

gql`
  mutation CreateGameVersion(
    $gameId: Int!
    $content: Upload!
    $isDraft: Boolean
  ) {
    createGameVersion(
      input: { gameId: $gameId, content: $content, isDraft: $isDraft }
    ) {
      previewLink
      congratulationMsg
      gameVersion {
        gameId
        gameVersionId
      }
    }
  }
`
