import { Box, Text } from "ink"
import React, { useState } from "react"

import { GameDevType } from "../../generated/types.js"

import { ChooseGameStep } from "./ChooseGameStep.js"
import { ChooseMemberStep } from "./ChooseMemberStep.js"
import { ChooseMemberTypeStep } from "./ChooseMemberTypeStep.js"

export function UpdateMembers() {
  const [gameId, setGameId] = useState<number | null>()
  const [memberId, setMemberId] = useState<number | null>()
  const [memberType, setMemberType] = useState<GameDevType>()

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
      {memberId !== undefined && (
        <ChooseMemberTypeStep
          currentMemberType={memberType}
          onComplete={setMemberType}
        />
      )}
      {memberType !== undefined && <Text>TODO: next {memberId}</Text>}
    </Box>
  )
}
