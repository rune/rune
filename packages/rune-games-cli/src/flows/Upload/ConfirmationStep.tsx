import React, { useState, useEffect } from "react"

import { Choose } from "../../components/Choose.js"
import { Step } from "../../components/Step.js"
import { useGame } from "../../gql/useGame.js"

export function ConfirmationStep({
  gameId,
  gameDir,
  onComplete,
}: {
  gameId: number
  gameDir: string
  onComplete: (confirmed: boolean) => void
}) {
  const { game } = useGame(gameId)
  const [confirmed, setConfirmed] = useState<boolean | undefined>()

  useEffect(() => {
    if (confirmed) onComplete(confirmed)
  }, [confirmed, onComplete])

  return (
    <Step
      status={
        !game
          ? "waiting"
          : confirmed === undefined
          ? "userInput"
          : confirmed
          ? "success"
          : "error"
      }
      label={
        game
          ? `Will upload a new version of "${game.title}" from ${gameDir}. Are you sure?`
          : "..."
      }
      view={
        !!game &&
        confirmed === undefined && (
          <Choose
            options={["No", "Yes"]}
            onSubmit={(response) => setConfirmed(response === "Yes")}
          />
        )
      }
    />
  )
}
