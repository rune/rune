import { Text, Box } from "ink"
import React, { useMemo } from "react"

import { GamesQuery, Me } from "../../generated/types.js"
import { gameDevItemLabel } from "../../lib/gameDevItemLabel.js"

export function Details({
  game,
  me,
}: {
  game: NonNullable<GamesQuery["games"]>["nodes"][0]
  me: Me
}) {
  const gameDevs = useMemo(() => game?.gameDevs.nodes, [game])
  const gameDevMe = useMemo(
    () => gameDevs?.find((gameDev) => gameDev.userId === me?.devId),
    [gameDevs, me]
  )

  if (!game) return <></>

  return (
    <Box flexDirection="column">
      <Box flexDirection="column" borderStyle="single">
        <Text bold>{game.title}</Text>
      </Box>
      <Box flexDirection="column">
        <DetailsRow name="Description" value={game.description} />
        <DetailsRow
          name="Team"
          value={gameDevs
            ?.map((gameDev) => gameDevItemLabel({ gameDev }))
            .join(", ")}
        />
        <DetailsRow
          name="Your role"
          value={gameDevMe ? gameDevMe.type : "PLAYER"}
        />
      </Box>
    </Box>
  )
}

const DetailsRow = ({
  name,
  value,
}: {
  name: string
  value: string | null
}) => (
  <Box flexDirection="row">
    <Text bold>{name}: </Text>
    <Text>{value}</Text>
  </Box>
)
