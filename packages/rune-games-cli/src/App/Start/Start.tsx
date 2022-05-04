import { Text, Box, Spacer } from "ink"
import { UncontrolledTextInput } from "ink-text-input"
import path from "path"
import React, { useState, useMemo } from "react"

import { packageJson } from "../../lib/packageJson.js"
import { cli } from "../cli.js"

import { ExitKey } from "./ExitKey.js"
import { isGamePathValid } from "./isGamePathValid.js"
import { useAppServer } from "./useAppServer.js"
import { useGameServer } from "./useGameServer.js"
import { useLocalUrls } from "./useLocalUrls.js"

export function Start() {
  const [gamePathOrUrl, setGamePathOrUrl] = useState(cli.input[1] ?? ".")

  const gameType = useMemo(
    () => (gamePathOrUrl.match(/^https?:\/\//) ? "url" : "path"),
    [gamePathOrUrl]
  )
  const gamePathOrUrlValid = useMemo(
    () =>
      gameType === "path" ? isGamePathValid(gamePathOrUrl) : gameType === "url",
    [gamePathOrUrl, gameType]
  )

  const gameServer = useGameServer({
    gamePath:
      gameType === "path" && gamePathOrUrlValid ? gamePathOrUrl : undefined,
  })

  const appServer = useAppServer({
    gameUrl:
      gameType === "url"
        ? gamePathOrUrl
        : gameType === "path" && gameServer
        ? `http://localhost:${gameServer.port}`
        : undefined,
  })

  const appUrls = useLocalUrls(appServer?.port)

  const fullGamePathOrUrl = useMemo(
    () =>
      gameType === "path"
        ? path.relative(".", gamePathOrUrl) === ""
          ? "Current directory"
          : `\`${path.resolve(gamePathOrUrl)}\``
        : gamePathOrUrl,
    [gamePathOrUrl, gameType]
  )

  if (!gamePathOrUrlValid) {
    return (
      <Box flexDirection="column">
        <Text color="red">{fullGamePathOrUrl} is not a valid game path</Text>
        <Text color="red">
          A game path must be a directory containing an index.html file
        </Text>
        <Box height={1} />
        <Text color="yellow">
          <Text underline>Please enter the game path or URL</Text>
          <Text>:</Text>
        </Text>
        <UncontrolledTextInput
          placeholder="Game URL or path"
          onSubmit={setGamePathOrUrl}
        />
      </Box>
    )
  }

  return (
    <Box>
      <Box
        paddingX={4}
        paddingY={1}
        borderStyle="round"
        borderColor={gamePathOrUrlValid ? "green" : "red"}
        flexDirection="column"
      >
        <Text color="green">App is available at {appUrls.join(", ")}</Text>
        <Text color="green">Game: {fullGamePathOrUrl}</Text>
        <Box height={1} />
        <Box>
          <ExitKey />
          <Box width={1} />
          <Spacer />
          <Text>Rune CLI v{packageJson.version}</Text>
        </Box>
      </Box>
      <Spacer />
    </Box>
  )
}
