import { Text, Box } from "ink"
import React, { useCallback, useMemo, useState } from "react"

import { Select } from "../../components/Select.js"
import { Step } from "../../components/Step.js"
import { useGames, useMyGames, gameItemLabel } from "../../gql/useGames.js"
import { useMe } from "../../gql/useMe.js"

import { Details } from "./Details.js"

export function List() {
  const { me } = useMe()
  const { games, gamesLoading } = useGames({ skip: !me })
  const { myGames, otherGames } = useMyGames({ games, devId: me?.devId })
  const [gameId, setGameId] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = useCallback(() => setSubmitted(true), [])

  const items = useMemo(
    () => [
      ...(myGames ?? []).map((game) => ({
        label: gameItemLabel({ game, showGameDevs: false }),
        value: game.id,
      })),
      ...(me?.admin
        ? (otherGames ?? []).map((game) => ({
            label: gameItemLabel({ game, showGameDevs: true }),
            value: game.id,
          }))
        : []),
    ],
    [myGames, otherGames, me]
  )

  if (!me) return <></>

  if (submitted && gameId) {
    return <Details gameId={gameId} />
  }

  return (
    <Box flexDirection="column">
      {gamesLoading ? (
        <Step status="waiting" label="Loading games" />
      ) : items.length > 0 ? (
        <Select
          items={items}
          value={gameId}
          onChange={setGameId}
          onSubmit={onSubmit}
        />
      ) : (
        <Text dimColor>You have not uploaded any games yet</Text>
      )}
    </Box>
  )
}
