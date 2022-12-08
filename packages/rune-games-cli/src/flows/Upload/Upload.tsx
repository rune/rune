import { Box } from "ink"
import React, { useState } from "react"

import { GameType } from "../../generated/types.js"

import { ChooseGameStep } from "./ChooseGameStep.js"
import { CreateGameStep } from "./CreateGameStep.js"
import { CreateGameVersionStep } from "./CreateGameVersionStep.js"
import { GameDirInputStep } from "./GameDirInputStep.js"

export function Upload() {
  const [gameDir, setGameDir] = useState<string | undefined>()
  const [multiplayer, setMultiplayer] = useState<boolean>(false)
  const [gameId, setGameId] = useState<number | null | undefined>()

  return (
    <Box flexDirection="column">
      <GameDirInputStep
        onComplete={({ gameDir, multiplayer }) => {
          setGameDir(gameDir)
          setMultiplayer(multiplayer)
        }}
      />
      {gameDir !== undefined && (
        <ChooseGameStep currentGameId={gameId} onComplete={setGameId} />
      )}
      {gameId === null && (
        <CreateGameStep
          type={multiplayer ? GameType.MULTIPLAYER : GameType.SINGLEPLAYER}
          onComplete={setGameId}
        />
      )}
      {!!gameId && !!gameDir && (
        <CreateGameVersionStep
          gameId={gameId}
          gameDir={gameDir}
          multiplayer={multiplayer}
        />
      )}
    </Box>
  )
}
