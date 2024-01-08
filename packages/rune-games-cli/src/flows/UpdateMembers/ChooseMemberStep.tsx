import React, { useState, useMemo, useCallback, useEffect } from "react"

import { Select } from "../../components/Select.js"
import { Step } from "../../components/Step.js"
import { useGame } from "../../gql/useGame.js"
import { useMe } from "../../gql/useMe.js"
import { gameDevItemLabel } from "../../lib/gameDevItemLabel.js"

export function ChooseMemberStep({
  gameId,
  currentMemberId,
  onComplete,
}: {
  gameId: number
  currentMemberId: number | null | undefined
  onComplete: (memberId: number | null) => void
}) {
  const { me } = useMe()
  const { game, gameLoading } = useGame(gameId)
  const [memberId, setMemberId] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const gameDevs = useMemo(() => game?.gameDevs.nodes, [game])
  const gameDevMe = useMemo(
    () => gameDevs?.find((gameDev) => gameDev.userId === me?.devId),
    [gameDevs, me?.devId]
  )

  useEffect(() => {
    if (currentMemberId) setMemberId(currentMemberId)
  }, [currentMemberId])

  const items = useMemo(
    () => [
      { label: "New member", value: null },
      ...(gameDevs ?? [])
        .filter((gameDev) => gameDev.userId !== gameDevMe?.userId)
        .map((gameDev) => ({
          label: gameDevItemLabel({ gameDev }),
          value: gameDev.userId,
        })),
    ],
    [gameDevs, gameDevMe?.userId]
  )

  const onSubmit = useCallback(() => setSubmitted(true), [])

  useEffect(() => {
    if (submitted) onComplete(memberId)
  }, [memberId, onComplete, submitted])

  const chosenMemberLabel = useMemo(() => {
    if (memberId === null) return "New Member selected"

    return `${
      gameDevs?.find((gameDev) => gameDev.userId === memberId)?.displayName ??
      "..."
    } member selected`
  }, [memberId, gameDevs])

  if (gameDevMe?.type !== "ADMIN" && !me?.admin) {
    return <Step status="error" label="You are not admin of this game" />
  }

  return (
    <Step
      status={gameLoading ? "waiting" : submitted ? "success" : "userInput"}
      label={
        gameLoading
          ? "Loading a list of members"
          : submitted
          ? chosenMemberLabel
          : "Select a member"
      }
      view={
        !gameLoading &&
        !submitted && (
          <Select
            items={items}
            value={memberId}
            onChange={setMemberId}
            onSubmit={onSubmit}
          />
        )
      }
    />
  )
}
