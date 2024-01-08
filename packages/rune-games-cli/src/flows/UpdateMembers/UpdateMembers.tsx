import { Box, Text } from "ink"
import React, { useState } from "react"

import { ChooseGameStep } from "./ChooseGameStep.js"

export function UpdateMembers() {
  const [gameId, setGameId] = useState<number | null>(null)

  return (
    <Box flexDirection="column">
      <ChooseGameStep currentGameId={gameId} onComplete={setGameId} />

      {!!gameId && <Text>TODO: next {gameId}</Text>}
    </Box>
  )
}
