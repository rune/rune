import { Text } from "ink"
import path from "path"
import React, { useEffect, useState } from "react"

import { Step } from "../components/Step.js"
import {
  createRuneGame,
  pull,
  readRuneJson,
  uploadCheckpoint,
} from "../lib/checkpointSync.js"

type State =
  | { status: "waiting" }
  | { status: "success"; label: string; detail?: string }
  | { status: "error"; label: string }

function useTask(task: () => Promise<{ label: string; detail?: string }>) {
  const [state, setState] = useState<State>({ status: "waiting" })
  useEffect(() => {
    task()
      .then((done) => setState({ status: "success", ...done }))
      .catch((e: Error) => {
        setState({ status: "error", label: e.message })
        process.exitCode = 1
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return state
}

function TaskView({ state, waiting }: { state: State; waiting: string }) {
  return (
    <Step
      status={state.status}
      label={state.status === "waiting" ? waiting : state.label}
      view={
        state.status === "success" && state.detail ? (
          <Text>{state.detail}</Text>
        ) : null
      }
    />
  )
}

export function Pull({ args }: { args: string[] }) {
  const dir = process.cwd()
  const gameKey = args[0] ?? readRuneJson(dir)?.gameKey

  const state = useTask(async () => {
    if (!gameKey) {
      throw new Error("Which game? Run `rune pull <game key>`.")
    }
    const { commitHash, fileCount, overwritten } = await pull(dir, gameKey)
    return {
      label: `Pulled ${fileCount} files at checkpoint ${commitHash}`,
      detail: `${
        overwritten ? `Replaced ${overwritten} local files. ` : ""
      }rune.json now links ${path.basename(dir)} to ${gameKey}.`,
    }
  })

  return <TaskView state={state} waiting="Pulling the current checkpoint" />
}

export function CheckpointUpload({
  args,
  release,
  newTitle,
}: {
  args: string[]
  release: boolean
  newTitle?: string
}) {
  const dir = path.resolve(args[0] ?? ".")

  const state = useTask(async () => {
    const created = newTitle ? await createRuneGame(dir, newTitle) : null
    const { commitHash, previewLink } = await uploadCheckpoint(dir, release)
    return {
      label: created
        ? `Created “${newTitle}” (${created.gameKey}) and uploaded its first checkpoint ${commitHash}`
        : `Uploaded as checkpoint ${commitHash}`,
      detail: `Test link: ${previewLink}${
        created ? `\nOpen it in Rune: ${created.editorLink}` : ""
      }`,
    }
  })

  return <TaskView state={state} waiting="Uploading as a checkpoint" />
}
