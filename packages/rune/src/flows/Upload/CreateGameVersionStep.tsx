import AdmZip from "adm-zip"
import { Box, Text, Newline } from "ink"
import path from "path"
import React, { useEffect } from "react"

import { OpenLinkStep } from "../../components/OpenLinkStep.js"
import { Step } from "../../components/Step.js"
import { useCreateGameVersion } from "../../gql/useCreateGameVersion.js"
import { useGame } from "../../gql/useGame.js"
import { useMe } from "../../gql/useMe.js"
import { publishLink } from "../../lib/appLinks.js"
import { formatApolloError } from "../../lib/formatApolloError.js"
import { getGameFiles } from "../../lib/getGameFiles.js"

export function CreateGameVersionStep({
  gameId,
  gameDir,
  readyForRelease,
  shouldPostToDiscord,
}: {
  gameId: number
  gameDir: string
  readyForRelease: boolean
  shouldPostToDiscord: boolean
}) {
  const {
    createGameVersion,
    createGameVersionLoading,
    createGameVersionError,
    newGameVersionId,
    previewLink,
    congratulationMsg,
  } = useCreateGameVersion()

  const { me } = useMe()
  const { game } = useGame(gameId)

  const isGameDev = game?.gameDevs.nodes.some(
    (gameDev) => gameDev.userId === me?.devId
  )

  useEffect(() => {
    getGameFiles(gameDir).then((gameFiles) => {
      const zip = new AdmZip()

      gameFiles.forEach((file) => {
        const fileDir = path.dirname(path.relative(gameDir, file.path))
        zip.addLocalFile(file.path, fileDir === "." ? "" : fileDir)
      })

      createGameVersion({
        gameId,
        isDraft: !readyForRelease,
        content: {
          name: "content.zip",
          content: zip.toBuffer(),
          type: "application/zip",
        },
        postToDiscord: shouldPostToDiscord,
      })
    })
  }, [readyForRelease, createGameVersion, gameDir, gameId, shouldPostToDiscord])

  return (
    <Box flexDirection="column">
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
              "[tango][GAME_VALIDATION_FAILED]":
                "Game validation failed. Make sure you are using latest CLI version. If the validation still fails after updating, then please write us in the Rune Discord server: https://discord.gg/rune-ai",
            })
          ) : (
            <>
              {readyForRelease
                ? `Version #${newGameVersionId} uploaded successfully and is now in review 🥳`
                : `Version #${newGameVersionId} uploaded successfully!`}{" "}
              You can test it here: {previewLink}
              <Newline />
              <Text color="yellow">
                (only share this link with other devs who are helping playtest
                your game)
              </Text>
              <Newline />
              You can also test your game in the Rune app.
              {shouldPostToDiscord && (
                <>
                  <Newline />
                  <Text color="blue">
                    Check Discord #game-launch channel for feedback from Rune
                    and other game devs!
                  </Text>
                </>
              )}
              {congratulationMsg && (
                <>
                  <Newline />
                  <Newline />
                  <Text color="green">{congratulationMsg}</Text>
                  <Newline />
                </>
              )}
            </>
          )
        }
      />

      {newGameVersionId && !createGameVersionError && game && isGameDev && (
        <OpenLinkStep
          label="Publish page"
          link={publishLink(game.key)}
          openedLabel="Publish page opened"
          promptToOpen={readyForRelease}
        />
      )}
    </Box>
  )
}
