import { Text, Box } from "ink"
import React from "react"

import { Step } from "../../components/Step.js"
import { useGame } from "../../gql/useGame.js"
import { useMe } from "../../gql/useMe.js"

export function Details({ gameId }: { gameId: number }) {
  const { me } = useMe()
  const { game, gameLoading } = useGame(gameId)
  const gameDevs = game?.gameDevs.nodes
  const gameDevMe = gameDevs?.find((gameDev) => gameDev.userId === me?.devId)

  if (gameLoading) {
    return <Step status="waiting" label="Loading game" />
  }

  if (!game) return <></>

  return (
    <Box flexDirection="column">
      <Box flexDirection="column" borderStyle="single">
        <Text bold>{game.title}</Text>
      </Box>
      <Box flexDirection="column">
        <Text>Game description: {game.description}</Text>
        <Text>Team role: {gameDevMe ? gameDevMe.type : "PLAYER"}</Text>
        <Text>
          Game devs:{" "}
          {gameDevs
            ?.map((gameDev) => `${gameDev.displayName} (${gameDev.type})`)
            .join(", ")}
        </Text>
      </Box>
    </Box>
  )
}
