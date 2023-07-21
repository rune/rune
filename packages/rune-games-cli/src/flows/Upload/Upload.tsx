import { Box } from "ink"
import React, { useState } from "react"

import { GameType } from "../../generated/types.js"

import { ChooseGameStep } from "./ChooseGameStep.js"
import { ConfirmationStep } from "./ConfirmationStep.js"
import { CreateGameStep } from "./CreateGameStep.js"
import { CreateGameVersionStep } from "./CreateGameVersionStep.js"
import { GameDirInputStep } from "./GameDirInputStep.js"
import { ReadyForReleaseStep } from "./ReadyForReleaseStep.js"

export function Upload() {
  const [gameDir, setGameDir] = useState<string | undefined>()
  const [multiplayer, setMultiplayer] = useState<boolean>(false)
  const [gameId, setGameId] = useState<number | null | undefined>()
  const [readyForRelease, setReadyForRelease] = useState<boolean | undefined>(
    undefined
  )
  const [confirmed, setConfirmed] = useState(false)

  return (
    <Box flexDirection="column">
      <GameDirInputStep
        onComplete={({ gameDir, multiplayer }) => {
          setGameDir(gameDir)
          setMultiplayer(multiplayer)
        }}
      />
      {gameDir !== undefined && (
        <ReadyForReleaseStep onComplete={setReadyForRelease} />
      )}
      {gameDir !== undefined && readyForRelease !== undefined && (
        <ChooseGameStep currentGameId={gameId} onComplete={setGameId} />
      )}
      {gameId === null && readyForRelease !== undefined && (
        <CreateGameStep
          type={multiplayer ? GameType.MULTIPLAYER : GameType.SINGLEPLAYER}
          onComplete={setGameId}
        />
      )}
      {!!gameId &&
        !!gameDir &&
        readyForRelease !== undefined &&
        (confirmed ? (
          <CreateGameVersionStep
            gameId={gameId}
            gameDir={gameDir}
            readyForRelease={readyForRelease}
            multiplayer={multiplayer}
          />
        ) : (
          <ConfirmationStep
            gameId={gameId}
            gameDir={gameDir}
            onComplete={setConfirmed}
          />
        ))}
    </Box>
  )
}
