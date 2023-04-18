import fetch from "cross-fetch"
import { Text, Box, Spacer, useInput } from "ink"
import path from "path"
import qrcode from "qrcode-terminal"
import React, { useState, useMemo, useEffect } from "react"

import { cli } from "../../lib/cli.js"
import {
  getGameFiles,
  FileInfo,
  findShortestPathFileThatEndsWith,
} from "../../lib/getGameFiles.js"
import { packageJson } from "../../lib/packageJson.js"
import {
  validateGameFiles,
  ValidationResult,
} from "../../lib/validateGameFiles.js"

import { ExitKey } from "./ExitKey.js"
import { getLocalUrls } from "./getLocalUrls.js"
import { renderErrorCodeLine } from "./renderCodeError.js"
import { useAppServer } from "./useAppServer.js"
import { useGameServer } from "./useGameServer.js"

export function Start() {
  const gamePathOrUrl = cli.input[1] ?? "."
  const [qrCodeText, setQrCodeText] = useState<string | null>(null)
  const [gameFiles, setGameFiles] = useState<FileInfo[]>([])
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null)
  const [ignoreValidation, setIgnoreValidation] = useState(false)

  const logicJsFile = useMemo(
    () => findShortestPathFileThatEndsWith(gameFiles, "logic.js"),
    [gameFiles]
  )

  const gameType = useMemo(
    () => (gamePathOrUrl.match(/^https?:\/\//) ? "url" : "path"),
    [gamePathOrUrl]
  )

  useEffect(() => {
    if (gameType === "path") {
      getGameFiles(gamePathOrUrl)
        .then((gameFiles) => {
          setGameFiles(gameFiles)

          return validateGameFiles(gameFiles)
        })
        .then(setValidationResult)
    } else {
      Promise.all([
        fetch(`${gamePathOrUrl}`).then((result) => result.text()),
        fetch(`${gamePathOrUrl}/logic.js`).then((result) => result.text()),
      ])
        .then(([indexHtml, logicJs]) => {
          const gameFiles = [
            { content: indexHtml, path: "index.html", size: indexHtml.length },
            { content: logicJs, path: "logic.js", size: logicJs.length },
          ]

          setGameFiles(gameFiles)

          return validateGameFiles(gameFiles)
        })
        .then(setValidationResult)
    }
  }, [gamePathOrUrl, gameType])

  const gameServer = useGameServer({
    gamePath:
      gameType === "path" && (validationResult?.valid || ignoreValidation)
        ? gamePathOrUrl
        : undefined,
  })

  const appServer = useAppServer({
    gameUrl: validationResult
      ? gameType === "url"
        ? gamePathOrUrl
        : gameType === "path" && gameServer
        ? `http://localhost:${gameServer.port}`
        : undefined
      : undefined,
    multiplayer: validationResult?.multiplayer,
  })

  const appUrls = getLocalUrls(appServer?.port)

  const fullGamePathOrUrl = useMemo(
    () =>
      gameType === "path"
        ? path.relative(".", gamePathOrUrl) === ""
          ? "current directory"
          : `${path.resolve(gamePathOrUrl)}`
        : gamePathOrUrl,
    [gamePathOrUrl, gameType]
  )

  useEffect(() => {
    if (appUrls.ip) qrcode.generate(appUrls.ip, { small: true }, setQrCodeText)
  }, [appUrls.ip])

  const showValidationErrors =
    !!validationResult && !validationResult?.valid && !ignoreValidation

  useInput(
    (input) => {
      if (input === "y") setIgnoreValidation(true)
      else if (input === "n") process.exit()
    },
    { isActive: showValidationErrors }
  )

  if (showValidationErrors) {
    return (
      <Box>
        <Box flexDirection="column">
          <Box
            flexDirection="column"
            borderStyle="round"
            borderColor="yellow"
            paddingX={1}
          >
            <Text bold>Game directory: {fullGamePathOrUrl}</Text>
            <Text color="yellow" bold>
              Some issues found during game files validation:
            </Text>
            {validationResult?.errors.map((error, i) => (
              <Box key={i} paddingLeft={0} flexDirection="column">
                <Text color="red">
                  {i + 1}) {error.message}
                </Text>
                {!!error.lintErrors?.length && (
                  <Box paddingLeft={2} flexDirection="column">
                    {error.lintErrors.map((lintError, i) => (
                      <Box key={i} flexDirection="column">
                        <Text>
                          - {lintError.message} ({lintError.ruleId})
                        </Text>
                        {logicJsFile?.content && (
                          <Box paddingLeft={2}>
                            {renderErrorCodeLine({
                              code: logicJsFile.content,
                              ...lintError,
                            })}
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
          <Text>Do you still want to proceed? (Y/N)</Text>
        </Box>
        <Spacer />
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
