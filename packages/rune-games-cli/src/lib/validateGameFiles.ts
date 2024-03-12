import { ESLint, Linter } from "eslint"
import { parse, valid } from "node-html-parser"
import path from "path"
import semver from "semver"

import { extractMultiplayerMetadata } from "./extractMultiplayerMetadata.js"
import { FileInfo, findShortestPathFileThatEndsWith } from "./getGameFiles.js"
import { rootPath } from "./rootPath.js"

import LintMessage = Linter.LintMessage

export const MAX_PLAYERS = 6

export const validationOptions = {
  sdkUrlStart: "https://cdn.jsdelivr.net/npm/rune-games-sdk",
  sdkVersionRegex: /rune-games-sdk@(\d+(\.\d+(\.\d+)?)?)/,
  minSdkVersion: "4.8.1",
  maxFiles: 1000,
  maxSizeMb: 10,
}

const eslint = new ESLint({
  useEslintrc: false,
  allowInlineConfig: false,
  resolvePluginsRelativeTo: rootPath,
  baseConfig: {
    root: true,
    extends: ["plugin:rune/logic"],
    parserOptions: {
      sourceType: "module",
    },
  },
})

export interface ValidationError {
  message: string
  lintErrors?: LintMessage[]
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  multiplayer?: {
    minPlayers?: number
    maxPlayers?: number
    handlesPlayerJoined?: boolean
    handlesPlayerLeft?: boolean
    updatesPerSecond?: number
    updatesPerSecondDefined?: boolean
    inputDelay?: number
  }
}

export function parseGameIndexHtml(indexHtmlContent: string) {
  if (!valid(indexHtmlContent)) return null

  const { sdkUrlStart } = validationOptions

  const parsedIndexHtml = parse(indexHtmlContent)
  const scripts = parsedIndexHtml.getElementsByTagName("script")
  const sdkScript = scripts.find((script) =>
    script.getAttribute("src")?.startsWith(sdkUrlStart)
  )

  return { parsedIndexHtml, scripts, sdkScript }
}

export async function validateGameFiles(
  files: FileInfo[]
): Promise<ValidationResult> {
  const { sdkVersionRegex, minSdkVersion, maxFiles, maxSizeMb } =
    validationOptions

  const errors: ValidationError[] = []

  if (files.length > maxFiles) {
    errors.push({ message: `Too many files (>${maxFiles})` })
  }

  const totalSize = files.reduce((acc, file) => acc + file.size, 0)

  if (totalSize > maxSizeMb * 1e6) {
    errors.push({ message: `Game size must be less than ${maxSizeMb}MB` })
  }

  const indexHtml = findShortestPathFileThatEndsWith(files, "index.html")
  const logicJs = findShortestPathFileThatEndsWith(files, "logic.js")

  if (logicJs && logicJs.size > 1e6) {
    errors.push({ message: `logic.js size can't be more than 1MB` })
  }

  let multiplayerValidationResult: ValidationResult["multiplayer"]

  if (!indexHtml) {
    errors.push({ message: "Game must include index.html" })
  } else if (!indexHtml.content) {
    errors.push({
      message: "index.html content has not been provided for validation",
    })
  } else {
    const gameIndexHtmlElements = parseGameIndexHtml(indexHtml.content)

    if (!gameIndexHtmlElements) {
      errors.push({ message: "index.html is not valid HTML" })
    } else if (!gameIndexHtmlElements.sdkScript) {
      errors.push({
        message: "Game index.html must include Rune SDK script",
      })
    } else {
      const { sdkScript, scripts } = gameIndexHtmlElements

      const { sdkUrlStart } = validationOptions
      if (scripts.filter(script => script.getAttribute("src")?.startsWith(sdkUrlStart)).length > 1) {
        errors.push({
          message: "Rune SDK is imported 2+ times in index.html. If using the Rune Vite plugin, then remove your SDK import in index.html.",
        })
      }

      if (
        sdkScript.getAttribute("src")?.endsWith("/multiplayer.js") ||
        sdkScript.getAttribute("src")?.endsWith("/multiplayer-dev.js")
      ) {
        multiplayerValidationResult =
          (await validateMultiplayer({
            errors,
            logicJs,
            indexHtml,
          })) ?? {}

        if (scripts.indexOf(sdkScript) !== 0) {
          errors.push({
            message: "Rune SDK must be the first script in index.html",
          })
        }

        const sdkVersion = sdkScript
          .getAttribute("src")
          ?.match(sdkVersionRegex)?.[1]

        if (!sdkVersion) {
          errors.push({ message: `Rune SDK must specify a version` })
        }

        const [major, minor, patch] = (sdkVersion ?? "").split(".")
        const maxedOutSdkVersion = `${major}.${minor ?? 999}.${patch ?? 999}`

        const sdkVersionCoerced = semver.coerce(
          sdkVersion && maxedOutSdkVersion
        )
        const minSdkVersionCoerced = semver.coerce(minSdkVersion)

        if (
          sdkVersionCoerced &&
          minSdkVersionCoerced &&
          semver.lt(sdkVersionCoerced, minSdkVersionCoerced)
        ) {
          errors.push({
            message: `Rune SDK is below minimum version (included ${sdkVersion}, min ${minSdkVersion})`,
          })
        }
      } else {
        errors.push({
          message: `Rune SDK script url must end with /multiplayer.js or /multiplayer-dev.js`,
        })
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    multiplayer: multiplayerValidationResult,
  }
}

async function validateMultiplayer({
  errors,
  logicJs,
  indexHtml,
}: {
  errors: ValidationError[]
  logicJs: FileInfo | undefined
  indexHtml: FileInfo
}): Promise<ValidationResult["multiplayer"]> {
  if (!logicJs) {
    errors.push({
      message: "logic.js must be included in the game files",
    })
  } else {
    if (path.dirname(indexHtml.path) !== path.dirname(logicJs.path)) {
      errors.push({
        message: "logic.js must be in the same directory as index.html",
      })
    }

    return validateMultiplayerLogicJsContent({
      logicJs,
      errors,
    })
  }
}

async function validateMultiplayerLogicJsContent({
  logicJs,
  errors,
}: {
  logicJs: FileInfo
  errors: ValidationError[]
}): Promise<ValidationResult["multiplayer"]> {
  if (!logicJs.content) {
    errors.push({
      message: "logic.js content has not been provided for validation",
    })
  } else {
    await eslint
      .lintText(logicJs.content)
      .then((results) => {
        const result = results.at(0)

        if (result) {
          const lintErrors = result.messages.filter((err) => err.severity === 2)

          if (lintErrors.length > 0) {
            errors.push({
              message: "logic.js contains invalid code",
              lintErrors,
            })
          }
        } else {
          errors.push({ message: "failed to lint logic.js" })
        }
      })
      .catch(() => {
        errors.push({ message: "failed to lint logic.js" })
      })

    const multiplayerMetadata = extractMultiplayerMetadata(logicJs.content)

    if (
      !multiplayerMetadata.minPlayers ||
      isNaN(multiplayerMetadata.minPlayers)
    ) {
      errors.push({
        message: "logic.js: minPlayers not found or is invalid",
      })
    }

    if (
      !multiplayerMetadata.maxPlayers ||
      isNaN(multiplayerMetadata.maxPlayers)
    ) {
      errors.push({
        message: "logic.js: maxPlayers not found or is invalid",
      })
    }

    if (
      multiplayerMetadata.minPlayers &&
      (multiplayerMetadata.minPlayers < 1 ||
        multiplayerMetadata.minPlayers > MAX_PLAYERS)
    ) {
      errors.push({
        message: `logic.js: minPlayers must be between 1 and ${MAX_PLAYERS}`,
      })
    }

    if (
      multiplayerMetadata.maxPlayers &&
      (multiplayerMetadata.maxPlayers < 1 ||
        multiplayerMetadata.maxPlayers > MAX_PLAYERS)
    ) {
      errors.push({
        message: `logic.js: maxPlayers must be between 1 and ${MAX_PLAYERS}`,
      })
    }

    if (
      multiplayerMetadata.maxPlayers &&
      multiplayerMetadata.minPlayers &&
      multiplayerMetadata.maxPlayers < multiplayerMetadata.minPlayers
    ) {
      errors.push({
        message:
          "logic.js: maxPlayers must be greater than or equal to minPlayers",
      })
    }

    if (multiplayerMetadata.updatesPerSecondDefined) {
      if (multiplayerMetadata.updatesPerSecond === undefined) {
        errors.push({
          message:
            "logic.js: updatesPerSecond must be a constant (updatesPerSecond: 1-30)",
        })
      } else if (
        multiplayerMetadata.updatesPerSecond < 1 ||
        multiplayerMetadata.updatesPerSecond > 30
      ) {
        errors.push({
          message:
            "logic.js: updatesPerSecond must be undefined or between 1 and 30",
        })
      }
    }

    if (multiplayerMetadata.inputDelay !== undefined) {
      if (
        multiplayerMetadata.inputDelay < 0 ||
        multiplayerMetadata.inputDelay > 50
      ) {
        errors.push({
          message: "logic.js: inputDelay must be undefined or between 0 and 50",
        })
      }
    }

    return multiplayerMetadata
  }
}
