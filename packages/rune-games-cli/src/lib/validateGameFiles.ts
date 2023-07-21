import { ESLint, Linter } from "eslint"
import { parse, valid } from "node-html-parser"
import path from "path"
import semver from "semver"

import { extractMultiplayerMetadata } from "./extractMultiplayerMetadata.js"
import { FileInfo, findShortestPathFileThatEndsWith } from "./getGameFiles.js"
import { rootPath } from "./rootPath.js"

import LintMessage = Linter.LintMessage

export const validationOptions = {
  sdkUrlStart: "https://cdn.jsdelivr.net/npm/rune-games-sdk",
  sdkVersionRegex: /rune-games-sdk@(\d+(\.\d+(\.\d+)?)?)/,
  minSdkVersion: "4.8.1",
  maxFiles: 1000,
  maxSizeMb: 25,
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

      if (
        sdkScript.getAttribute("src")?.endsWith("/multiplayer.js") ||
        sdkScript.getAttribute("src")?.endsWith("/multiplayer-dev.js")
      ) {
        multiplayerValidationResult = {}

        await validateMultiplayer({
          multiplayerValidationResult,
          errors,
          logicJs,
          indexHtml,
        })
      }

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

      const sdkVersionCoerced = semver.coerce(sdkVersion && maxedOutSdkVersion)
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
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    multiplayer: multiplayerValidationResult,
  }
}

async function validateMultiplayer({
  multiplayerValidationResult,
  errors,
  logicJs,
  indexHtml,
}: {
  multiplayerValidationResult: NonNullable<ValidationResult["multiplayer"]>
  errors: ValidationError[]
  logicJs: FileInfo | undefined
  indexHtml: FileInfo
}) {
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

    await validateMultiplayerLogicJsContent({
      logicJs,
      multiplayerValidationResult,
      errors,
    })
  }

  return multiplayerValidationResult
}

async function validateMultiplayerLogicJsContent({
  logicJs,
  multiplayerValidationResult,
  errors,
}: {
  logicJs: FileInfo
  multiplayerValidationResult: NonNullable<ValidationResult["multiplayer"]>
  errors: ValidationError[]
}) {
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

    Object.assign(
      multiplayerValidationResult,
      extractMultiplayerMetadata(logicJs.content)
    )

    if (
      !multiplayerValidationResult.minPlayers ||
      isNaN(multiplayerValidationResult.minPlayers)
    ) {
      errors.push({
        message: "logic.js: minPlayers not found or is invalid",
      })
    }

    if (
      !multiplayerValidationResult.maxPlayers ||
      isNaN(multiplayerValidationResult.maxPlayers)
    ) {
      errors.push({
        message: "logic.js: maxPlayers not found or is invalid",
      })
    }

    if (
      multiplayerValidationResult.minPlayers &&
      (multiplayerValidationResult.minPlayers < 1 ||
        multiplayerValidationResult.minPlayers > 4)
    ) {
      errors.push({
        message: "logic.js: minPlayers must be between 1 and 4",
      })
    }

    if (
      multiplayerValidationResult.maxPlayers &&
      (multiplayerValidationResult.maxPlayers < 1 ||
        multiplayerValidationResult.maxPlayers > 4)
    ) {
      errors.push({
        message: "logic.js: maxPlayers must be between 1 and 4",
      })
    }

    if (
      multiplayerValidationResult.maxPlayers &&
      multiplayerValidationResult.minPlayers &&
      multiplayerValidationResult.maxPlayers <
        multiplayerValidationResult.minPlayers
    ) {
      errors.push({
        message:
          "logic.js: maxPlayers must be greater than or equal to minPlayers",
      })
    }
  }

  return multiplayerValidationResult
}
