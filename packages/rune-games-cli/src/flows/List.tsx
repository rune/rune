import figures from "figures"
import { Text, Box } from "ink"
import React from "react"

import { useGames, useMyGames, gameItemLabel } from "../gql/useGames.js"
import { useMe } from "../gql/useMe.js"

export function List() {
  const { me } = useMe()
  const { games } = useGames({ skip: !me })
  const { myGames } = useMyGames({ games, devId: me?.devId })

  if (!me) return <></>

  return (
    <Box flexDirection="column">
      <Text bold>Your games:</Text>
      {myGames?.length ? (
        myGames.map((game) => (
          <Text key={game.id}>
            {figures.bullet} {gameItemLabel({ game, me })}
          </Text>
        ))
      ) : (
        <Text dimColor>You have not uploaded any games yet</Text>
      )}
      {me?.admin && (
        <>
          <Text bold>All games:</Text>
          {games?.map((game) => (
            <Text key={game.id}>
              {figures.bullet}{" "}
              {gameItemLabel({ game, me, showDevDisplayName: true })}
            </Text>
          ))}
        </>
      )}
    </Box>
  )
}
