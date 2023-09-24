import { Box } from "ink"
import React, { useEffect, useState } from "react"

import { useGames, useMyGames } from "../../gql/useGames.js"
import { useMe } from "../../gql/useMe.js"

import { ChooseGameStep } from "./ChooseGameStep.js"
import { ConfirmationStep } from "./ConfirmationStep.js"
import { CreateGameStep } from "./CreateGameStep.js"
import { CreateGameVersionStep } from "./CreateGameVersionStep.js"
import { GameDirInputStep } from "./GameDirInputStep.js"
import { ReadyForReleaseStep } from "./ReadyForReleaseStep.js"

export function Upload() {
  const [gameDir, setGameDir] = useState<string | undefined>()
  const [gameId, setGameId] = useState<number | null | undefined>()
  const [readyForRelease, setReadyForRelease] = useState<boolean | undefined>(
    undefined
  )
  const [needConfirmation, setNeedConfirmation] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const { me } = useMe()
  const { games } = useGames({ skip: !me })
  const { myGames } = useMyGames({ games, devId: me?.devId })

  useEffect(() => {
    if (myGames && myGames.length > 1) setNeedConfirmation(true)
  }, [myGames])

  return (
    <Box flexDirection="column">
      <GameDirInputStep
        onComplete={({ gameDir }) => {
          setGameDir(gameDir)
        }}
      />
      {gameDir !== undefined && (
        <ReadyForReleaseStep onComplete={setReadyForRelease} />
      )}
      {gameDir !== undefined && readyForRelease !== undefined && (
        <ChooseGameStep currentGameId={gameId} onComplete={setGameId} />
      )}
      {gameId === null && readyForRelease !== undefined && (
        <CreateGameStep onComplete={setGameId} />
      )}
      {!!gameId &&
        !!gameDir &&
        readyForRelease !== undefined &&
        (confirmed || !needConfirmation ? (
          <CreateGameVersionStep
            gameId={gameId}
            gameDir={gameDir}
            readyForRelease={readyForRelease}
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
