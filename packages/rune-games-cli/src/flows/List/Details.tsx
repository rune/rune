import { Text, Box } from "ink"
import React from "react"

import { GamesQuery, Me } from "../../generated/types.js"

export function Details({
  game,
  me,
}: {
  game: NonNullable<GamesQuery["games"]>["nodes"][0]
  me: Me
}) {
  const gameDevs = game?.gameDevs.nodes
  const gameDevMe = gameDevs?.find((gameDev) => gameDev.userId === me?.devId)

  if (!game) return <></>

  return (
    <Box flexDirection="column">
      <Box flexDirection="column" borderStyle="single">
        <Text bold>{game.title}</Text>
      </Box>
      <Box flexDirection="column">
        <Text>Description: {game.description}</Text>
        <Text>
          Devs:{" "}
          {gameDevs
            ?.map((gameDev) => `${gameDev.displayName} (${gameDev.type})`)
            .join(", ")}
        </Text>
        <Text>Your team role: {gameDevMe ? gameDevMe.type : "PLAYER"}</Text>
      </Box>
    </Box>
  )
}
