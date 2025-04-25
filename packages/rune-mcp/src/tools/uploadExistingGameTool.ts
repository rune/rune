import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import { isLoggedIn } from "../services/login.js"
import { logError } from "../services/logging.js"
import { isDir } from "rune/lib/isDir.js"
import {
  buildGame,
  getGameErrors,
  uploadNewGameVersion,
} from "../services/game.js"
import {
  uploadExistingGameToolDescription,
  gameIdParameterDescription,
} from "../text/uploadExistingGameToolText.js"
import {
  isReadyForReleaseParameterDescription,
  projectPathInvalid,
  projectPathParameterDescription,
  projectValidationFailed,
  redirectToLoginToolResponse,
  uploadDraftSuccessResponse,
  uploadReleaseSuccessResponse,
} from "../text/commonUploadGameToolText.js"

export const uploadExistingGameTool = (server: McpServer) => {
  server.tool(
    "upload-existing-rune-game",
    uploadExistingGameToolDescription,
    {
      gameId: z.number().int().positive().describe(gameIdParameterDescription),
      projectPath: z.string().describe(projectPathParameterDescription),
      isReadyForRelease: z
        .boolean()
        .describe(isReadyForReleaseParameterDescription),
    },
    async ({ isReadyForRelease, projectPath, gameId }) => {
      server.server.sendLoggingMessage({
        level: "info",
        data: `Preparing to update game with ID: ${gameId}`,
      })

      server.server.sendLoggingMessage({
        level: "info",
        data: "Checking dev is logged in...",
      })

      let loggedIn = false
      try {
        loggedIn = await isLoggedIn()
      } catch (error) {
        logError(server, error, "Error checking if logged in")
      }

      if (!loggedIn) {
        server.server.sendLoggingMessage({
          level: "warning",
          data: "Dev user is not logged in. Redirecting to login tool.",
        })
        return {
          content: [
            {
              type: "text",
              text: redirectToLoginToolResponse,
            },
          ],
        }
      }

      // User is logged in, proceed with upload functionality
      server.server.sendLoggingMessage({
        level: "info",
        data: "User is logged in. Checking Project path...",
      })

      if (!isDir(projectPath)) {
        server.server.sendLoggingMessage({
          level: "error",
          data: `Project directory not found: ${projectPath}`,
        })
        return {
          content: [
            {
              type: "text",
              text: projectPathInvalid(projectPath),
            },
          ],
        }
      }

      // build the app for production
      server.server.sendLoggingMessage({
        level: "info",
        data: "Building the app for production...",
      })

      try {
        const buildOutput = await buildGame(projectPath)
        server.server.sendLoggingMessage({
          level: "info",
          data: `Build output: ${buildOutput}`,
        })
      } catch (error) {
        logError(server, error, "Error building the app for production")
        return {
          content: [
            {
              type: "text",
              text: `Error building the app: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        }
      }

      const distPath = `${projectPath}/dist`

      server.server.sendLoggingMessage({
        level: "info",
        data: "Project is built. Checking for project errors...",
      })

      const validationResult = await getGameErrors(distPath)

      if (validationResult.valid === false) {
        server.server.sendLoggingMessage({
          level: "warning",
          data: `Project validation failed: ${validationResult.error}`,
        })
        return {
          content: [
            {
              type: "text",
              text: projectValidationFailed(validationResult.error),
            },
          ],
        }
      }

      try {
        const { congratulationMsg, newGameVersionId, previewLink } =
          await uploadNewGameVersion({
            gameId,
            gameDir: distPath,
            isReadyForRelease,
            shouldPostToDiscord: true,
          })

        server.server.sendLoggingMessage({
          level: "info",
          data: "Game upload Complete",
        })

        return {
          content: [
            {
              type: "text",
              text: isReadyForRelease
                ? uploadReleaseSuccessResponse({
                    gameId,
                    newGameVersionId,
                    previewLink,
                    congratulationMsg,
                  })
                : uploadDraftSuccessResponse({
                    gameId,
                    newGameVersionId,
                    previewLink,
                    congratulationMsg,
                  }),
            },
          ],
        }
      } catch (error) {
        logError(server, error, "Error uploading the game")
        return {
          content: [
            {
              type: "text",
              text: `Error uploading the game: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        }
      }
    }
  )
}
