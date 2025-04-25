import AdmZip from "adm-zip"
import { spawn } from "child_process"
import path from "path"
import {
  findShortestPathFileThatEndsWith,
  getGameFiles,
} from "rune/lib/getGameFiles.js"
import { getMyGames } from "rune/lib/getMyGames.js"
import { validateGameFilesInCLI } from "rune/lib/validateGameFilesInCli.js"
import { createGameVersion } from "rune/query/createGameVersion.js"
import { queryGames } from "rune/query/queryGames.js"
import { queryMe } from "rune/query/queryMe.js"

/**
 * Type representing a game developer
 */
export type GameDeveloper = {
  name: string | null
  type: string
}

/**
 * Type representing a game in the Rune platform
 */
export type Game = {
  id: number
  title: string
  gameDevs: GameDeveloper[]
  latestVersionStatus: string
}

/**
 * Renders a code error line as a markdown string
 * This is a markdown version of the renderErrorCodeLine function from @rune/lib/renderCodeError
 */
export const renderErrorCodeLineAsMarkdown = ({
  code,
  line,
  column,
  endLine,
  endColumn,
}: {
  code: string
  line: number
  column: number
  endLine?: number
  endColumn?: number
}): string => {
  const lines = code.split("\n")
  let content = lines[line - 1]

  if (!content) return ""

  endColumn = endLine === line ? (endColumn ?? column) : content?.length

  const spacesAtTheStart = content.match(/^\s+/)?.[0]?.length ?? 0
  content = content.slice(spacesAtTheStart)
  column -= spacesAtTheStart
  endColumn -= spacesAtTheStart

  // Format as markdown with error highlighting using backticks and bold
  return `\`${line}:${column}\` \`${content.slice(0, column - 1)}**${content.slice(column - 1, endColumn - 1)}**${content.slice(endColumn - 1)}\``
}

export const getGameErrors = async (
  projectPath: string
): Promise<{ valid: true } | { valid: false; error: string }> => {
  const gameFiles = await getGameFiles(projectPath)

  const logicJsFile = findShortestPathFileThatEndsWith(gameFiles, "logic.js")

  const validationResult = await validateGameFilesInCLI(gameFiles)

  if (validationResult.valid) {
    return {
      valid: true,
    }
  }

  // Format errors as a single numbered string
  const error = validationResult.errors.reduce((acc, error, index) => {
    // Add the main error message with numbering
    let errorText = `${index + 1}) ${error.message}\n`

    // Add any lint errors as sub-items
    if (error.lintErrors?.length) {
      errorText +=
        error.lintErrors
          .map((lintError) => {
            let out = `   - ${lintError.message} ${lintError.ruleId ? `(${lintError.ruleId})` : ""}`
            if (logicJsFile?.content) {
              out += `\n    ${renderErrorCodeLineAsMarkdown({
                code: logicJsFile?.content,
                ...lintError,
              })}`
            }
            return out
          })
          .join("\n") + "\n"
    }

    return acc + errorText + "\n"
  }, "")

  return {
    valid: false,
    error,
  }
}

export const buildGame = async (projectPath: string): Promise<string> => {
  const pkgManager = process.env.npm_config_user_agent?.split("/")[0] || "npm"
  process.chdir(projectPath)
  // spawn a child process and run npm run build in the supplied directory
  return await new Promise((resolve, reject) => {
    let outputBuffer = ""
    const child = spawn(pkgManager, ["run", "build"], {
      //Fixes issue when running on windows https://stackoverflow.com/a/54515183
      shell: process.platform === "win32",
    })

    child.stdout?.on("data", (data) => {
      outputBuffer += data.toString()
    })

    child.stderr?.on("data", (data) => {
      outputBuffer += `[ERROR]: ${data.toString()}`
    })

    child.on("error", (error) => {
      reject(error)
    })

    child.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Build process exited with code ${code}`))
      } else {
        resolve(outputBuffer)
      }
    })
  })
}

export const getGames = async (): Promise<Game[]> => {
  const [
    { games },
    {
      me: { devId },
    },
  ] = await Promise.all([queryGames(), queryMe()])

  const { myGames } = getMyGames({ games, devId })

  return (
    myGames?.map((game) => ({
      id: game.id,
      title: game.title,
      gameDevs: game.gameDevs.nodes.map((dev) => ({
        name: dev.displayName,
        type: dev.type,
      })),
      latestVersionStatus: game.gameVersions.nodes[0]?.status ?? "NONE",
    })) ?? []
  )
}

export const uploadNewGameVersion = async ({
  gameId,
  gameDir,
  isReadyForRelease,
  shouldPostToDiscord,
}: {
  gameId: number
  gameDir: string
  isReadyForRelease: boolean
  shouldPostToDiscord: boolean
}) => {
  const gameFiles = await getGameFiles(gameDir)

  const zip = new AdmZip()

  gameFiles.forEach((file) => {
    const fileDir = path.dirname(path.relative(gameDir, file.path))
    zip.addLocalFile(file.path, fileDir === "." ? "" : fileDir)
  })

  return await createGameVersion({
    gameId,
    isDraft: !isReadyForRelease,
    postToDiscord: shouldPostToDiscord,
    content: {
      name: "content.zip",
      content: zip.toBuffer(),
      type: "application/zip",
    },
  })
}
