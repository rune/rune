import { Box, Text } from "ink"
import React, { useEffect, useState } from "react"

import { useGames, useMyGames } from "../../gql/useGames.js"
import { useMe } from "../../gql/useMe.js"
import { CliFlags } from "../../lib/cli.js"

import { ChooseGameStep } from "./ChooseGameStep.js"
import { ConfirmationStep } from "./ConfirmationStep.js"
import { CreateGameStep } from "./CreateGameStep.js"
import { CreateGameVersionStep } from "./CreateGameVersionStep.js"
import { GameDirInputStep } from "./GameDirInputStep.js"
import { ReadyForReleaseStep } from "./ReadyForReleaseStep.js"

export function Upload({ flags }: { flags: CliFlags }) {
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
  const { release, name, confirm } = flags

  useEffect(() => {
    if (myGames && myGames.length > 1) setNeedConfirmation(true)
  }, [myGames])

  useEffect(() => {
    release && setReadyForRelease(release)
    const gameFromInputFlag =
      name &&
      myGames?.filter(
        (game) => game.title.toLowerCase() === name.toLowerCase()
      )[0]
    gameFromInputFlag && setGameId(gameFromInputFlag.id)

    confirm && setConfirmed(confirm)
  }, [confirm, myGames, name, release])

  return (
    <Box flexDirection="column">
      <Text>
        When your game is published, your Rune profile will be shown next to the
        game.
      </Text>
      <GameDirInputStep
        onComplete={({ gameDir }) => {
          setGameDir(gameDir)
        }}
      />
      {gameDir !== undefined && readyForRelease === undefined && (
        <ReadyForReleaseStep onComplete={setReadyForRelease} />
      )}
      {gameDir !== undefined &&
        readyForRelease !== undefined &&
        (gameId === undefined || gameId === null) && (
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
