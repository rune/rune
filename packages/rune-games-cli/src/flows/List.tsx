import { Text, Box } from "ink"
import React, { useMemo, useState } from "react"

import { Select } from "../components/Select.js"
import { useGames, useMyGames, gameItemLabel } from "../gql/useGames.js"
import { useMe } from "../gql/useMe.js"

export function List() {
  const { me } = useMe()
  const { games, gamesLoading } = useGames({ skip: !me })
  const { myGames } = useMyGames({ games, devId: me?.devId })
  const [gameId, setGameId] = useState<number | null>(null)

  const items = useMemo(
    () =>
      me?.admin
        ? (games ?? []).map((game) => ({
            label: gameItemLabel({ game, showGameDevs: true }),
            value: game.id,
          }))
        : (myGames ?? []).map((game) => ({
            label: gameItemLabel({ game, showGameDevs: false }),
            value: game.id,
          })),
    [games, myGames, me]
  )

  if (!me) return <></>

  return (
    <Box flexDirection="column">
      <Text bold>{me?.admin ? "All games:" : "Your games:"}</Text>
      {gamesLoading ? (
        <Text dimColor>Loading...</Text>
      ) : items.length > 0 ? (
        <Select
          items={items}
          value={gameId}
          onChange={setGameId}
          onSubmit={() => console.log("SHOW IT", gameId)}
        />
      ) : (
        <Text dimColor>You have not uploaded any games yet</Text>
      )}
    </Box>
  )
}
