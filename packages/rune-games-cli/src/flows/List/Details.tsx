import { Text, Box } from "ink"
import React from "react"

export function Details({ gameId }: { gameId: number }) {
  return (
    <Box flexDirection="column">
      <Text bold>Game #{gameId}</Text>
    </Box>
  )
}
