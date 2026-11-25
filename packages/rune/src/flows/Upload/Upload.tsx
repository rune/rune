import { Box, Newline, Text } from "ink"
import React, { useCallback, useEffect, useState } from "react"

import { OpenLinkStep } from "../../components/OpenLinkStep.js"
import { Step } from "../../components/Step.js"
import {
  fetchCurrentCheckpoint,
  uploadCheckpoint,
} from "../../gql/uploadCheckpoint.js"
import { apiErrorCode, apiErrorMessage } from "../../lib/apiErrorMessage.js"
import { publishLink } from "../../lib/appLinks.js"
import { readProjectFile, writeProjectFile } from "../../lib/projectFile.js"
import { gameFilesDir, zipProject } from "../../lib/zipProject.js"

import { LinkGameStep } from "./LinkGameStep.js"

// Its own exit code, so scripts can tell "edited in Rune" from a failure.
const CHANGED_IN_RUNE_EXIT_CODE = 2
const CHANGED_IN_RUNE =
  "This game was changed in Rune since your last upload. Keep working there."

class ChangedInRuneError extends Error {}

type UploadState =
  | { step: "linking" }
  | { step: "uploading" }
  | { step: "done"; gameKey: string; previewLink: string }
  | { step: "error"; message: string; exitCode: number }

async function uploadProject(dir: string, release: boolean) {
  const project = readProjectFile(dir)
  if (!project) throw new Error(`No rune.json in ${dir}`)

  const current = await fetchCurrentCheckpoint(project.gameKey)
  if (current === null && project.base !== null) {
    throw new Error(
      "The game is being reverted in Rune. Try again in a moment."
    )
  }
  if (current !== project.base) throw new ChangedInRuneError(CHANGED_IN_RUNE)

  const content = await zipProject(dir)
  let result
  try {
    result = await uploadCheckpoint({
      gameKey: project.gameKey,
      base: project.base,
      release,
      content: { name: "content.zip", content, type: "application/zip" },
    })
  } catch (error) {
    if (apiErrorCode(error) === "CHECKPOINT_MOVED") {
      throw new ChangedInRuneError(CHANGED_IN_RUNE)
    }
    throw error
  }
  writeProjectFile(dir, { gameKey: project.gameKey, base: result.commitHash })

  return { gameKey: project.gameKey, previewLink: result.previewLink }
}

export function Upload({
  dir,
  release,
  name,
  description,
}: {
  dir: string
  release: boolean
  name: string | undefined
  description: string | undefined
}) {
  const [state, setState] = useState<UploadState>(() => {
    try {
      gameFilesDir(dir)
      return readProjectFile(dir) ? { step: "uploading" } : { step: "linking" }
    } catch (error) {
      return { step: "error", message: apiErrorMessage(error), exitCode: 1 }
    }
  })

  const [needsLink] = useState(state.step === "linking")

  const onLinked = useCallback(() => setState({ step: "uploading" }), [])
  const onError = useCallback(
    (message: string) => setState({ step: "error", message, exitCode: 1 }),
    []
  )

  useEffect(() => {
    if (state.step !== "uploading") return

    uploadProject(dir, release)
      .then((result) => setState({ step: "done", ...result }))
      .catch((error) =>
        setState({
          step: "error",
          message: apiErrorMessage(error),
          exitCode:
            error instanceof ChangedInRuneError ? CHANGED_IN_RUNE_EXIT_CODE : 1,
        })
      )
  }, [dir, release, state.step])

  useEffect(() => {
    if (state.step === "error") process.exitCode = state.exitCode
  }, [state])

  return (
    <Box flexDirection="column">
      {needsLink && (
        <LinkGameStep
          dir={dir}
          name={name}
          description={description}
          onLinked={onLinked}
          onError={onError}
        />
      )}
      {state.step === "uploading" && (
        <Step status="waiting" label={`Uploading ${dir}`} />
      )}
      {state.step === "error" && <Step status="error" label={state.message} />}
      {state.step === "done" && (
        <>
          <Step
            status="success"
            label={
              <>
                {release
                  ? "Uploaded and submitted for review 🥳"
                  : "Uploaded! The Rune editor shows it as a checkpoint you can revert."}{" "}
                You can test it here: {state.previewLink}
                <Newline />
                <Text color="yellow">
                  (only share this link with other devs who are helping playtest
                  your game)
                </Text>
              </>
            }
          />
          <OpenLinkStep
            label="Publish page"
            link={publishLink(state.gameKey)}
            openedLabel="Publish page opened"
            promptToOpen={release}
          />
        </>
      )}
    </Box>
  )
}
