import { Box } from "ink"
import TextInputImport from "ink-text-input"
import React, { useState, useCallback, useEffect } from "react"

import { Step } from "../../components/Step.js"
import { useGame } from "../../gql/useGame.js"
import { useUpdateGame } from "../../gql/useUpdateGame.js"
import { formatApolloError } from "../../lib/formatApolloError.js"
import { prepareFileUpload } from "../../lib/prepareFileUpload.js"

// @ts-ignore
const TextInput = TextInputImport.default as typeof TextInputImport

export function UpdateGameStep({ gameId }: { gameId: number }) {
  const { game } = useGame(gameId)
  const [title, setTitle] = useState("")
  const [titleSubmitted, setTitleSubmitted] = useState(false)
  const [description, setDescription] = useState("")
  const [descriptionSubmitted, setDescriptionSubmitted] = useState(false)
  const [logoPath, setLogoPath] = useState("")
  const [logoPathSubmitted, setLogoPathSubmitted] = useState(false)
  const { updateGame, updateGameLoading, updateGameError, updatedGame } =
    useUpdateGame()

  const onSubmitTitle = useCallback(() => {
    if (title) setTitleSubmitted(true)
  }, [title])

  const onSubmitDescription = useCallback(() => {
    setDescriptionSubmitted(true)
  }, [])

  const onSubmitLogoPath = useCallback(() => {
    setLogoPathSubmitted(true)
  }, [])

  useEffect(() => {
    if (titleSubmitted && descriptionSubmitted && logoPathSubmitted) {
      updateGame({
        gameId,
        title,
        description,
        ...(logoPath && { logo: prepareFileUpload(logoPath) }),
      })
    }
  }, [
    description,
    descriptionSubmitted,
    gameId,
    logoPath,
    logoPathSubmitted,
    title,
    titleSubmitted,
    updateGame,
  ])

  useEffect(() => {
    if (updateGameError) {
      setTitleSubmitted(false)
      setDescriptionSubmitted(false)
      setLogoPathSubmitted(false)
    }
  }, [updateGameError])

  useEffect(() => {
    // Set initial values of game
    if (game) {
      if (!titleSubmitted) setTitle(game.title)

      if (!descriptionSubmitted && game.description) {
        setDescription(game.description)
      }
    }
  }, [titleSubmitted, descriptionSubmitted, game])

  return (
    <Box flexDirection="column">
      <Step
        status={titleSubmitted ? "success" : "userInput"}
        label={
          titleSubmitted
            ? `Will set the title to ${title}`
            : "Enter the updated game title"
        }
        view={
          !titleSubmitted && (
            <TextInput
              placeholder="My cool game"
              value={title}
              onChange={setTitle}
              onSubmit={onSubmitTitle}
            />
          )
        }
      />
      {titleSubmitted && (
        <Step
          status={descriptionSubmitted ? "success" : "userInput"}
          label={
            descriptionSubmitted
              ? description
                ? "Will set the description"
                : "Will not change the description"
              : "Enter the updated game description"
          }
          view={
            !descriptionSubmitted && (
              <TextInput
                placeholder="My cool game"
                value={description}
                onChange={setDescription}
                onSubmit={onSubmitDescription}
              />
            )
          }
        />
      )}
      {descriptionSubmitted && (
        <Step
          status={logoPathSubmitted ? "success" : "userInput"}
          label={
            logoPathSubmitted
              ? logoPath === ""
                ? "Will not update the game logo"
                : `Will update the logo to the one from ${logoPath}`
              : "Provide path to game logo (optional)"
          }
          view={
            !logoPathSubmitted && (
              <TextInput
                placeholder="/path/to/logo.png"
                value={logoPath}
                onChange={setLogoPath}
                onSubmit={onSubmitLogoPath}
              />
            )
          }
        />
      )}
      {(updateGameLoading || updateGameError) && (
        <Step
          status={updateGameLoading ? "waiting" : "error"}
          label={
            updateGameError
              ? formatApolloError(updateGameError, {
                  "Input buffer contains unsupported image format":
                    "Not an image file",
                  'value violates unique constraint "game_title_key"':
                    "Game with this title already exists",
                  default: `Something went wrong`,
                })
              : "Updating the game"
          }
        />
      )}
      {updatedGame && <Step status="success" label="Game updated" />}
    </Box>
  )
}
