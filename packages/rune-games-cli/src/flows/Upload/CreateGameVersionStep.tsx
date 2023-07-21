import AdmZip from "adm-zip"
import { Box, Text, Newline } from "ink"
import path from "path"
import React, { useState, useEffect } from "react"

import { Choose } from "../../components/Choose.js"
import { Step } from "../../components/Step.js"
import { useCreateGameVersion } from "../../gql/useCreateGameVersion.js"
import { useGame } from "../../gql/useGame.js"
import { formatApolloError } from "../../lib/formatApolloError.js"
import { getGameFiles } from "../../lib/getGameFiles.js"

export function CreateGameVersionStep({
  gameId,
  gameDir,
  readyForRelease,
  multiplayer,
}: {
  gameId: number
  gameDir: string
  readyForRelease: boolean
  multiplayer: boolean
}) {
  const { game, gameLoading } = useGame(gameId)
  const {
    createGameVersion,
    createGameVersionLoading,
    createGameVersionError,
    newGameVersionId,
    previewLink,
  } = useCreateGameVersion()
  const [challengeSupport, setChallengeSupport] = useState<
    boolean | undefined
  >()

  useEffect(() => {
    if (game?.gameVersions.nodes.find((version) => version.supportsChallenge)) {
      setChallengeSupport(true)
    }
  }, [game?.gameVersions.nodes])

  const gameCanSupportChallenges = !multiplayer
  const readyToUpload =
    typeof challengeSupport === "boolean" || !gameCanSupportChallenges

  useEffect(() => {
    if (readyToUpload) {
      getGameFiles(gameDir).then((gameFiles) => {
        const zip = new AdmZip()

        gameFiles.forEach((file) => {
          const fileDir = path.dirname(path.relative(gameDir, file.path))
          zip.addLocalFile(file.path, fileDir === "." ? "" : fileDir)
        })

        createGameVersion({
          gameId,
          challengeSupport,
          content: {
            name: "content.zip",
            content: zip.toBuffer(),
            type: "application/zip",
          },
        })
      })
    }
  }, [
    challengeSupport,
    createGameVersion,
    gameDir,
    gameId,
    readyForRelease,
    readyToUpload,
  ])

  return (
    <Box flexDirection="column">
      {gameCanSupportChallenges && (
        <Step
          status={
            gameLoading
              ? "waiting"
              : typeof challengeSupport === "boolean"
              ? "success"
              : "userInput"
          }
          label={
            gameLoading
              ? "Checking daily challenge support"
              : typeof challengeSupport === "boolean"
              ? `This game ${
                  challengeSupport ? "supports" : "does not support"
                } daily challenges`
              : "Does this game support daily challenges?"
          }
          view={
            !gameLoading &&
            challengeSupport === undefined && (
              <Choose
                options={["No", "Yes"]}
                onSubmit={(response) => setChallengeSupport(response === "Yes")}
              />
            )
          }
        />
      )}
      {readyToUpload && (
        <Step
          status={
            createGameVersionLoading
              ? "waiting"
              : createGameVersionError
              ? "error"
              : "success"
          }
          label={
            createGameVersionLoading ? (
              "Uploading a new game version"
            ) : createGameVersionError ? (
              formatApolloError(createGameVersionError, {
                default: "Something went wrong",
              })
            ) : (
              <>
                Version #{newGameVersionId} uploaded successfully and is now in
                review 🥳 You can test it here: {previewLink}
                <Newline />
                <Text color="yellow">
                  (only share this link with other devs who are helping playtest
                  your game)
                </Text>
              </>
            )
          }
        />
      )}
    </Box>
  )
}
