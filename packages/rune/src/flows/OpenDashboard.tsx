import { Box, Text } from "ink"
import open from "open"
import React, { useState } from "react"

import { Choose } from "../components/Choose.js"
import { Step } from "../components/Step.js"
import { useGame } from "../gql/useGame.js"
import { formatApolloError } from "../lib/formatApolloError.js"

import { ChooseGameStep } from "./Upload/ChooseGameStep.js"

const appOrigin =
  process.env.STAGE === "launchpad"
    ? "https://launchpad.rune.ai"
    : "https://rune.ai"

export function OpenDashboard() {
  const [gameId, setGameId] = useState<number | null | undefined>()
  const { game, gameError } = useGame(gameId)
  const [status, setStatus] = useState<
    "waiting" | "opened" | "failedBrowser" | "skipped"
  >("waiting")

  const statsLink = game && `${appOrigin}/app/stats/${game.key}`

  return (
    <Box flexDirection="column">
      <ChooseGameStep
        currentGameId={gameId}
        onComplete={setGameId}
        onlyExisting
      />

      {gameError && <Text color="red">{formatApolloError(gameError, {})}</Text>}

      {statsLink && (
        <>
          <Text>
            Stats: <Text color="green">{statsLink}</Text>
          </Text>

          {status === "opened" ? (
            <Step status="success" label="Stats opened" />
          ) : status === "failedBrowser" ? (
            <Step
              status="error"
              label="Failed to open your default browser. Please open the link manually"
            />
          ) : status === "skipped" ? (
            <Step status="success" label="Done." />
          ) : (
            <Step
              status={"userInput"}
              label={"Open in default browser?"}
              view={
                <Choose
                  options={["Yes", "No"]}
                  onSubmit={(response) => {
                    const shouldOpen = response === "Yes"

                    if (shouldOpen) {
                      open(statsLink)
                        .then(() => {
                          setStatus("opened")
                        })
                        .catch(() => {
                          setStatus("failedBrowser")
                        })
                    } else {
                      setStatus("skipped")
                    }
                  }}
                />
              }
            />
          )}
        </>
      )}
    </Box>
  )
}
