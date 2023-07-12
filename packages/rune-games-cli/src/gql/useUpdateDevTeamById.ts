import { gql, useMutation } from "@apollo/client/index.js"
import { useCallback } from "react"

import {
  UpdateDevTeamByIdDocument,
  UpdateDevTeamByIdMutationVariables,
} from "../generated/types.js"

export function useUpdateDevTeamById() {
  const [mutate, result] = useMutation(UpdateDevTeamByIdDocument)

  return {
    updateDevTeamById: useCallback(
      (variables: UpdateDevTeamByIdMutationVariables) => {
        mutate({ variables }).catch(() => {})
      },
      [mutate]
    ),
    updateDevTeamByIdLoading: result.loading,
    updateDevTeamByIdError: result.error,
  }
}

gql`
  mutation UpdateDevTeamById($id: Int!, $patch: DevTeamPatch!) {
    updateDevTeamById(input: { id: $id, patch: $patch }) {
      devTeam {
        id
        handle
        twitter
      }
    }
  }
`
