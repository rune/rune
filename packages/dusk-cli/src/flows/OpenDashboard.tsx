import { Box, Text } from "ink"
import open from "open"
import React, { useEffect, useState } from "react"

import { Step } from "../components/Step.js"
import { useDashboardMagicLink } from "../gql/useMagicDashboardLink.js"
import { formatApolloError } from "../lib/formatApolloError.js"

export function OpenDashboard() {
  const { dashboardMagicLink, loading, error } = useDashboardMagicLink()
  const [status, setStatus] = useState<
    "waiting" | "opening" | "opened" | "failedBrowser"
  >("waiting")

  useEffect(() => {
    if (dashboardMagicLink) {
      setStatus("opening")

      open(dashboardMagicLink)
        .then(() => {
          setStatus("opened")
        })
        .catch(() => {
          setStatus("failedBrowser")
        })
    }
  }, [dashboardMagicLink])

  return (
    <Box flexDirection="column">
      {status === "waiting" && loading && (
        <Step status="waiting" label="Opening..." />
      )}
      {error && (
        <Text color="red">
          {formatApolloError(error, {
            default: `Something went wrong`,
          })}
        </Text>
      )}
      {status === "failedBrowser" && (
        <Text color="yellow">
          Failed to open your browser. Please open this link manually:{" "}
          {dashboardMagicLink}
        </Text>
      )}
      {status === "opened" && <Step status="success" label="Dashboard open!" />}
    </Box>
  )
}
