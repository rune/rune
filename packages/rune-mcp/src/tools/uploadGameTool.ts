import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import {
  isReadyForReleaseParameterDescription,
  projectPathInvalid,
  projectPathParameterDescription,
  projectValidationFailed,
  redirectToLoginToolResponse,
  uploadDraftSuccessResponse,
  uploadGameToolDescription,
  uploadReleaseSuccessResponse,
} from "../text/uploadGameToolText.js"
import { z } from "zod"
import { isLoggedIn } from "../services/login.js"
import { logError } from "../services/logging.js"
import { isDir } from "rune/lib/isDir.js"
import { buildGame, getGameErrors } from "../services/game.js"

export const uploadGameTool = (server: McpServer) => {
  server.tool(
    "upload-rune-game",
    uploadGameToolDescription,
    {
      projectPath: z.string().describe(projectPathParameterDescription),
      isReadyForRelease: z
        .boolean()
        .describe(isReadyForReleaseParameterDescription),
    },
    async ({ isReadyForRelease, projectPath }) => {
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
      // TODO: Implement the actual game upload functionality here

      server.server.sendLoggingMessage({
        level: "info",
        data: "Game upload Complete",
      })

      return {
        content: [
          {
            type: "text",
            text: isReadyForRelease
              ? uploadReleaseSuccessResponse
              : uploadDraftSuccessResponse,
          },
        ],
      }
    }
  )
}
