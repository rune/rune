import { Box, Text } from "ink"
import React, { useState } from "react"

import { ChooseGameStep } from "./ChooseGameStep.js"
import { ChooseMemberStep } from "./ChooseMemberStep.js"

export function UpdateMembers() {
  const [gameId, setGameId] = useState<number | null>(null)
  const [memberId, setMemberId] = useState<number | null | undefined>(undefined)

  return (
    <Box flexDirection="column">
      <ChooseGameStep currentGameId={gameId} onComplete={setGameId} />
      {!!gameId && (
        <ChooseMemberStep
          gameId={gameId}
          currentMemberId={memberId}
          onComplete={setMemberId}
        />
      )}
      {memberId !== undefined && <Text>TODO: next {memberId}</Text>}
    </Box>
  )
}
