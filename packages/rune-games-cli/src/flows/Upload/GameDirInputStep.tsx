import figures from "figures"
import { Box, Text } from "ink"
import TextInputImport from "ink-text-input"
import path from "path"
import React, { useState, useMemo, useCallback, useEffect } from "react"

import { Step } from "../../components/Step.js"
import { useValidateGame } from "../../gql/useValidateGame.js"
import { cli } from "../../lib/cli.js"

import { getGameFiles } from "./getGameFiles.js"

// @ts-ignore
const TextInput = TextInputImport.default as typeof TextInputImport

export function GameDirInputStep({
  onComplete,
}: {
  onComplete: (gameDir: string) => void
}) {
  const [gameDir, setGameDir] = useState(
    () => cli.input[1] ?? path.resolve(".")
  )
  const gameDirFormatted = useMemo(
    () =>
      path.relative(".", gameDir) === ""
        ? "Current directory"
        : path.resolve(gameDir),
    [gameDir]
  )
  const {
    validateGame,
    validateGameResult,
    validateGameLoading,
    validateGameError,
  } = useValidateGame()

  const onSubmitGameDir = useCallback(() => {
    getGameFiles(gameDir).then(validateGame)
  }, [gameDir, validateGame])

  useEffect(() => {
    if (validateGameResult?.valid) onComplete(gameDir)
  }, [gameDir, onComplete, validateGameResult?.valid])

  return (
    <>
      {!!validateGameResult?.errors.length && (
        <Step
          status="error"
          label="Some issues detected with your game"
          view={
            <Box flexDirection="column">
              {validateGameResult?.errors.map((error, i) => (
                <Text key={i} color="red">
                  {figures.line} {error}
                </Text>
              ))}
            </Box>
          }
        />
      )}
      <Step
        status={
          validateGameLoading
            ? "waiting"
            : validateGameError
            ? "error"
            : validateGameResult?.valid
            ? "success"
            : "userInput"
        }
        label={
          validateGameLoading
            ? "Validating game files"
            : validateGameResult?.valid
            ? `Using game files from ${gameDirFormatted}`
            : validateGameError
            ? "Something went wrong"
            : validateGameResult?.valid === false
            ? "Update your game to fix these issues 😄"
            : "Enter the game directory"
        }
        view={(status) => (
          <Box flexDirection="column">
            {(status === "userInput" || status === "error") && (
              <Box>
                <Text>Game directory: </Text>
                <TextInput
                  placeholder="/path/to/game"
                  value={gameDir}
                  onChange={setGameDir}
                  onSubmit={onSubmitGameDir}
                />
              </Box>
            )}
          </Box>
        )}
      />
    </>
  )
}
