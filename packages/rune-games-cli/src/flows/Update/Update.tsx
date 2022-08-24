import { Box } from "ink"
import React, { useState } from "react"

import { ChooseGameStep } from "../Upload/ChooseGameStep.js"

import { UpdateGameStep } from "./UpdateGameStep.js"

export function Update() {
  const [gameId, setGameId] = useState<number | null | undefined>()

  return (
    <Box flexDirection="column">
      <ChooseGameStep
        currentGameId={gameId}
        onComplete={setGameId}
        onlyExisting
      />
      {gameId && <UpdateGameStep gameId={gameId} />}
    </Box>
  )
}
