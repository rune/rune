import { gql, useMutation } from "@apollo/client/index.js"
import { useCallback } from "react"

import { ValidateGameDocument, GameFile } from "../generated/types.js"

export function useValidateGame() {
  const [mutate, result] = useMutation(ValidateGameDocument)

  return {
    validateGame: useCallback(
      (files: GameFile[]) => {
        mutate({ variables: { files } }).catch(() => {})
      },
      [mutate]
    ),
    validateGameResult: result.data?.validateGame,
    validateGameError: result.error,
    validateGameLoading: result.loading,
  }
}

gql`
  mutation ValidateGame($files: [GameFile!]!) {
    validateGame(input: { files: $files }) {
      valid
      errors
    }
  }
`
