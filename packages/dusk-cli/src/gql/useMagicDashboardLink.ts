import { gql, useMutation } from "@apollo/client/index.js"
import { useCallback } from "react"

import {
  DashboardMagicLinkDocument,
  DashboardMagicLinkInput,
} from "../generated/types.js"

export function useDashboardMagicLink() {
  const [mutate, result] = useMutation(DashboardMagicLinkDocument)

  return {
    getDashboardMagicLink: useCallback(
      (input: DashboardMagicLinkInput) => {
        mutate({ variables: { input } }).catch(() => {})
      },
      [mutate]
    ),
    loading: result.loading,
    error: result.error,
    dashboardMagicLink: result.data?.dashboardMagicLink.dashboardMagicLink,
  }
}

gql`
  mutation DashboardMagicLink($input: DashboardMagicLinkInput!) {
    dashboardMagicLink(input: $input) {
      clientMutationId
      dashboardMagicLink
    }
  }
`
