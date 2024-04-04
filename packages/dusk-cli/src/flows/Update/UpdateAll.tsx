import { ApolloError } from "@apollo/client/errors/index.js"
import { Box, Text } from "ink"
import React, { useEffect, useMemo, useRef, useState } from "react"

import { Step } from "../../components/Step.js"
import { useGames } from "../../gql/useGames.js"
import { useUpdateGameSdk } from "../../gql/useUpdateGameSdk.js"
import { formatApolloError } from "../../lib/formatApolloError.js"

export function UpdateAll() {
  const { updateGameSdk } = useUpdateGameSdk()

  const { games, gamesLoading } = useGames()

  const gamesWithLatestActiveVersions = useMemo(
    () =>
      games
        ?.map((g) => ({
          gameId: g.id,
          gameVersionId: g.gameVersions.nodes
            .filter((v) => v.status === "ACTIVE")
            .at(0)?.gameVersionId,
        }))
        .filter(
          (g): g is { gameId: number; gameVersionId: number } =>
            !!g.gameVersionId
        ),
    [games]
  )

  const queue = useRef(Promise.resolve())
  const [progressText, setProgressText] = useState("")
  const [successes, setSuccesses] = useState<
    { gameId: number; gameVersionId: number }[]
  >([])
  const [failures, setFailures] = useState<
    { gameId: number; gameVersionId: number; error: string }[]
  >([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!gamesLoading && gamesWithLatestActiveVersions) {
      gamesWithLatestActiveVersions.forEach(({ gameId, gameVersionId }, i) => {
        queue.current = queue.current.then(async () => {
          setProgressText(
            `Updating game ${i + 1} of ${gamesWithLatestActiveVersions.length}`
          )

          try {
            const result = await updateGameSdk({ gameId, gameVersionId })

            if (result?.success) {
              setSuccesses((prev) => [...prev, { gameId, gameVersionId }])
            } else {
              setFailures((prev) => [
                ...prev,
                {
                  gameId,
                  gameVersionId,
                  error: result?.error ?? "Unknown error",
                },
              ])
            }
          } catch (error) {
            setFailures((prev) => [
              ...prev,
              {
                gameId,
                gameVersionId,
                error:
                  error instanceof ApolloError
                    ? formatApolloError(error, {
                        "[tango][UPDATE_GAME_SDK_FAILED_SOME_GAMES_IN_REVIEW]":
                          "Cannot update any games while some games are in review",
                        default: error.message,
                      })
                    : JSON.stringify(error),
              },
            ])
          }
        })
      })

      queue.current.then(() => setDone(true))
    }
  }, [gamesLoading, gamesWithLatestActiveVersions, updateGameSdk])

  return (
    <Step
      status={done ? (failures.length ? "error" : "success") : "waiting"}
      label={
        done
          ? failures.length
            ? successes.length
              ? "Some games failed to update"
              : "All games failed to update"
            : "Finished updating all games"
          : progressText
      }
      view={
        done ? (
          <Box flexDirection="column">
            {!!successes.length && (
              <Box flexDirection="column">
                <Text color="green">Successfully updated games:</Text>
                <Box paddingLeft={1}>
                  <Text color="green">
                    {successes
                      .map(
                        ({ gameId, gameVersionId }) =>
                          `#${gameId} (v${gameVersionId})`
                      )
                      .join(", ")}
                  </Text>
                </Box>
              </Box>
            )}
            {!!failures.length && (
              <Box flexDirection="column">
                <Text color="red">Failed to update:</Text>
                <Box flexDirection="column" paddingLeft={1}>
                  {failures.map(({ gameId, gameVersionId, error }) => (
                    <Text key={`${gameId}-${gameVersionId}`} color="red">
                      #{gameId} (v{gameVersionId}): {error}
                    </Text>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        ) : (process.env.STAGE ?? "production") === "production" ? (
          <Text color="yellow">
            Updating all games increases the load on the server and might
            trigger alerts. Please notify the team in #tango slack that you are
            running this script
          </Text>
        ) : null
      }
    />
  )
}
