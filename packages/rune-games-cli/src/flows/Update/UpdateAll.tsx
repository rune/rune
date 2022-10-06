import { Box, Text } from "ink"
import React, { useEffect } from "react"

import { Step } from "../../components/Step.js"
import { useUpdateAllGames } from "../../gql/useUpdateAllGames.js"
import { formatApolloError } from "../../lib/formatApolloError.js"

export function UpdateAll() {
  const {
    updateAllGames,
    updateAllGamesLoading,
    updateAllGamesError,
    updateAllGamesResult,
  } = useUpdateAllGames()

  useEffect(() => {
    updateAllGames()
  }, [updateAllGames])

  return (
    <Step
      status={
        updateAllGamesLoading
          ? "waiting"
          : updateAllGamesError
          ? "error"
          : "success"
      }
      label={
        updateAllGamesLoading
          ? "Updating all games. This may take a while. Do not close the terminal!"
          : updateAllGamesError
          ? formatApolloError(updateAllGamesError, {
              "[tango][UPDATE_ALL_GAMES_FAILED_SOME_GAMES_IN_REVIEW]":
                "Cannot update all games while some games are in review",
              default: updateAllGamesError.message,
            })
          : "Finished updating all games"
      }
      view={
        <Box flexDirection="column">
          {!!updateAllGamesResult?.updatedGameIds.length && (
            <Text color="green">
              Successfully updated games:{" "}
              {updateAllGamesResult.updatedGameIds.join(", ")}
            </Text>
          )}
          {!!updateAllGamesResult?.failedToUpdateGameIds.length && (
            <Text color="red">
              Failed to update games:{" "}
              {updateAllGamesResult.failedToUpdateGameIds.join(", ")}
            </Text>
          )}
          {!!updateAllGamesResult?.errors.length && (
            <>
              <Text color="red">Errors:</Text>
              {updateAllGamesResult.errors.map((error, index) => (
                <Text key={index} color="red">
                  {error}
                </Text>
              ))}
            </>
          )}
        </Box>
      }
    />
  )
}
