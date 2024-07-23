import { useQuery, gql } from "@apollo/client/index.js"

import { DashboardMagicLinkDocument } from "../generated/types.js"

export function useDashboardMagicLink({ skip }: { skip?: boolean } = {}) {
  const { data, loading, error } = useQuery(DashboardMagicLinkDocument, {
    skip,
  })

  return {
    dashboardMagicLink: data?.dashboardMagicLink,
    loading,
    error,
  }
}

gql`
  query DashboardMagicLink {
    dashboardMagicLink
  }
`
