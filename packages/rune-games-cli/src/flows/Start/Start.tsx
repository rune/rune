import { Text, Box, Spacer } from "ink"
import { UncontrolledTextInput } from "ink-text-input"
import path from "path"
import qrcode from "qrcode-terminal"
import React, { useState, useMemo, useEffect } from "react"

import { cli } from "../../lib/cli.js"
import { packageJson } from "../../lib/packageJson.js"

import { ExitKey } from "./ExitKey.js"
import { getLocalUrls } from "./getLocalUrls.js"
import { isGamePathValid } from "./isGamePathValid.js"
import { useAppServer } from "./useAppServer.js"
import { useGameServer } from "./useGameServer.js"

export function Start() {
  const [gamePathOrUrl, setGamePathOrUrl] = useState(cli.input[1] ?? ".")
  const [qrCodeText, setQrCodeText] = useState<string | null>(null)

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

  const appUrls = getLocalUrls(appServer?.port)

  const fullGamePathOrUrl = useMemo(
    () =>
      gameType === "path"
        ? path.relative(".", gamePathOrUrl) === ""
          ? "Current directory"
          : `${path.resolve(gamePathOrUrl)}`
        : gamePathOrUrl,
    [gamePathOrUrl, gameType]
  )

  useEffect(() => {
    if (appUrls.ip) qrcode.generate(appUrls.ip, { small: true }, setQrCodeText)
  }, [appUrls.ip])

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
        borderColor="green"
        flexDirection="column"
      >
        <Text>
          <Text bold color="green">
            Test locally
          </Text>
          : {appUrls.localhost}
        </Text>
        {appUrls.ip && (
          <>
            <Text>
              <Text bold color="green">
                Test on your phone
              </Text>
              : {appUrls.ip} (or scan the QR code below, same network only)
            </Text>
            <Text>{qrCodeText}</Text>
          </>
        )}
        <Text>
          <Text bold color="green">
            Game
          </Text>
          : {fullGamePathOrUrl}
        </Text>
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
