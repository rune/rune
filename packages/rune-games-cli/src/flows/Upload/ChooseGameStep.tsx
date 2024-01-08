import React, { useState, useMemo, useCallback, useEffect } from "react"

import { Select } from "../../components/Select.js"
import { Step } from "../../components/Step.js"
import { useGames } from "../../gql/useGames.js"
import { useMe } from "../../gql/useMe.js"
import { gameItemLabel } from "../../lib/gameItemLabel.js"
import { getMyGames } from "../../lib/getMyGames.js"

export function ChooseGameStep({
  currentGameId,
  onComplete,
  onlyExisting,
}: {
  currentGameId: number | null | undefined
  onComplete: (gameId: number | null) => void
  onlyExisting?: boolean
}) {
  const { me } = useMe()
  const { games, gamesLoading } = useGames({ skip: !me })
  const [gameId, setGameId] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (currentGameId) setGameId(currentGameId)
  }, [currentGameId])

  const items = useMemo(() => {
    const { myGames, otherGames } = getMyGames({ games, devId: me?.devId })

    return [
      ...(onlyExisting ? [] : [{ label: "New game", value: null }]),
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
    ]
  }, [games, me, onlyExisting])

  useEffect(() => {
    if (onlyExisting && items.length && !gameId) setGameId(items[0]!.value)
  }, [gameId, items, onlyExisting])

  const onSubmit = useCallback(() => {
    setSubmitted(true)
    onComplete(gameId)
  }, [gameId, onComplete])

  const chosenGameLabel = useMemo(() => {
    if (gameId === null) return "New Game selected"

    return `${
      games?.find((game) => game.id === gameId)?.title ?? "..."
    } game selected`
  }, [gameId, games])

  if (!gamesLoading && items.length === 0) {
    return <Step status="error" label="No games found" />
  }

  return (
    <Step
      status={gamesLoading ? "waiting" : submitted ? "success" : "userInput"}
      label={
        gamesLoading
          ? "Loading a list of games"
          : submitted
          ? chosenGameLabel
          : "Select a game"
      }
      view={
        !gamesLoading &&
        !submitted && (
          <Select
            items={items}
            value={gameId}
            onChange={setGameId}
            onSubmit={onSubmit}
          />
        )
      }
    />
  )
}
