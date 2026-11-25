import { Box } from "ink"
import { UncontrolledTextInput } from "ink-text-input"
import React, { useCallback, useEffect, useMemo, useState } from "react"

import { Step } from "../../components/Step.js"
import { createRuneGame } from "../../gql/createRuneGame.js"
import { fetchCurrentCheckpoint } from "../../gql/uploadCheckpoint.js"
import { useGames } from "../../gql/useGames.js"
import { useMe } from "../../gql/useMe.js"
import { apiErrorMessage } from "../../lib/apiErrorMessage.js"
import { getMyGames } from "../../lib/getMyGames.js"
import { writeProjectFile } from "../../lib/projectFile.js"

import { ChooseGameStep } from "./ChooseGameStep.js"

type Choice =
  | { kind: "existing"; gameKey: string; title: string }
  | { kind: "new"; title: string; description: string }

async function linkFolder(dir: string, choice: Choice) {
  if (choice.kind === "existing") {
    const base = await fetchCurrentCheckpoint(choice.gameKey)
    writeProjectFile(dir, { gameKey: choice.gameKey, base })
    return `Linked this folder to "${choice.title}" in rune.json. This upload replaces the game's files in Rune, including edits made there; the editor keeps the previous files as a checkpoint you can revert to.`
  }

  const { gameKey, editorLink } = await createRuneGame(
    choice.title,
    choice.description
  )
  writeProjectFile(dir, { gameKey, base: null })
  return `Created "${choice.title}" on Rune and linked this folder to it in rune.json. Open it in the Rune editor: ${editorLink}`
}

export function LinkGameStep({
  dir,
  name,
  description,
  onLinked,
  onError,
}: {
  dir: string
  name: string | undefined
  description: string | undefined
  onLinked: () => void
  onError: (message: string) => void
}) {
  const { me } = useMe()
  const { games, gamesLoading } = useGames({ skip: !me })
  const myGames = useMemo(
    () => getMyGames({ games, devId: me?.devId }).myGames,
    [games, me]
  )
  const [choice, setChoice] = useState<Choice | null>(null)
  const [newTitle, setNewTitle] = useState<string | null>(null)
  const [linkedMessage, setLinkedMessage] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  const fail = useCallback(
    (message: string) => {
      setFailed(true)
      onError(message)
    },
    [onError]
  )

  useEffect(() => {
    if (!name || gamesLoading || !myGames) return

    const game = myGames.find(
      (game) => game.title.toLowerCase() === name.toLowerCase()
    )
    if (game) {
      setChoice({ kind: "existing", gameKey: game.key, title: game.title })
    } else if (description) {
      setChoice({ kind: "new", title: name, description })
    } else {
      fail(`You have no game called "${name}". Add --description to create it.`)
    }
  }, [name, description, gamesLoading, myGames, fail])

  useEffect(() => {
    if (!choice) return

    linkFolder(dir, choice)
      .then((message) => {
        setLinkedMessage(message)
        onLinked()
      })
      .catch((error) => fail(apiErrorMessage(error)))
  }, [dir, choice, onLinked, fail])

  const onChooseGame = useCallback(
    (gameId: number | null) => {
      const game = games?.find((game) => game.id === gameId)
      if (game) {
        setChoice({ kind: "existing", gameKey: game.key, title: game.title })
      } else {
        setNewTitle("")
      }
    },
    [games]
  )

  if (failed) return null
  if (linkedMessage) return <Step status="success" label={linkedMessage} />
  if (choice) return <Step status="waiting" label="Linking this folder" />
  if (name) return <Step status="waiting" label={`Looking for "${name}"`} />

  return (
    <Box flexDirection="column">
      <ChooseGameStep currentGameId={undefined} onComplete={onChooseGame} />
      {newTitle !== null && (
        <Step
          status="userInput"
          label={newTitle ? `Description for "${newTitle}"` : "Game title"}
          view={
            <UncontrolledTextInput
              key={newTitle ? "description" : "title"}
              onSubmit={(value) => {
                const text = value.trim()
                if (!text) return
                if (newTitle) {
                  setChoice({ kind: "new", title: newTitle, description: text })
                } else {
                  setNewTitle(text)
                }
              }}
            />
          }
        />
      )}
    </Box>
  )
}
