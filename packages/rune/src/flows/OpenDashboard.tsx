import { Box, Text } from "ink"
import React, { useState } from "react"

import { OpenLinkStep } from "../components/OpenLinkStep.js"
import { useGame } from "../gql/useGame.js"
import { statsLink } from "../lib/appLinks.js"
import { formatApolloError } from "../lib/formatApolloError.js"

import { ChooseGameStep } from "./Upload/ChooseGameStep.js"

export function OpenDashboard() {
  const [gameId, setGameId] = useState<number | null | undefined>()
  const { game, gameError } = useGame(gameId)

  return (
    <Box flexDirection="column">
      <ChooseGameStep
        currentGameId={gameId}
        onComplete={setGameId}
        onlyExisting
      />

      {gameError && <Text color="red">{formatApolloError(gameError, {})}</Text>}

      {game && (
        <OpenLinkStep
          label="Stats"
          link={statsLink(game.key)}
          openedLabel="Stats opened"
        />
      )}
    </Box>
  )
}
