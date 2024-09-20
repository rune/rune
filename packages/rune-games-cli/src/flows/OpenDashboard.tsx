import { Box, Text } from "ink"
import open from "open"
import React, { useEffect, useState } from "react"

import { Step } from "../components/Step.js"
import { useDashboardMagicLink } from "../gql/useMagicDashboardLink.js"
import { formatApolloError } from "../lib/formatApolloError.js"

export function OpenDashboard() {
  const { createDashboardMagicLink, dashboardMagicLink, error } =
    useDashboardMagicLink()
  const [status, setStatus] = useState<"waiting" | "opened" | "failedBrowser">(
    "waiting"
  )

  useEffect(() => {
    createDashboardMagicLink({})
  }, [createDashboardMagicLink])

  useEffect(() => {
    if (dashboardMagicLink) {
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
      {!error && status === "waiting" && (
        <Step status="waiting" label="Opening..." />
      )}
      {error && <Text color="red">{formatApolloError(error, {})}</Text>}
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
