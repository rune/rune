import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import {
  getCurrentProjectPath,
  openDevServerInBrowser,
  startDevServer,
  stopDevServer,
} from "../services/devServer.js"
import path from "path"
import fs from "fs"
import {
  projectPathParameterDescription,
  restartDevServerToolDescription,
  restartDevServerToolSuccessResponse,
} from "../text/restartDevServerToolText.js"

/**
 * Register the restart dev server tool with the MCP server
 */
export const restartDevServerTool = (server: McpServer): void => {
  server.tool(
    "restart-rune-dev-server",
    restartDevServerToolDescription,
    {
      projectPath: z
        .string()
        .optional()
        .describe(projectPathParameterDescription),
    },
    async ({ projectPath }) => {
      // Send notification that restart is beginning
      server.server.sendLoggingMessage({
        level: "info",
        data: "Restarting development server...",
      })

      // Stop the server if it's running
      await stopDevServer()

      // Determine which project path to use
      const pathToUse = projectPath || getCurrentProjectPath()

      if (!pathToUse) {
        server.server.sendLoggingMessage({
          level: "error",
          data: "No project path specified and no current project is running.",
        })

        throw new Error(
          "No project path specified and no current project is running. Run this command again and specify the path to the current project you would like to start the dev server for."
        )
      }

      // Verify the project path exists and is valid
      if (!fs.existsSync(pathToUse)) {
        throw new Error(`Project directory not found: ${pathToUse}`)
      }

      // Check if it has a package.json with a dev script
      const packageJsonPath = path.join(pathToUse, "package.json")
      if (!fs.existsSync(packageJsonPath)) {
        throw new Error(`package.json not found in ${pathToUse}`)
      }

      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"))
      if (!packageJson.scripts?.dev) {
        throw new Error(`No 'dev' script found in package.json in ${pathToUse}`)
      }

      // Start the dev server with the specified or current project
      // This command will stop the existing server if it's running
      const { localUrl, networkUrls } = await startDevServer({
        pathToProject: pathToUse,
        server,
      })

      server.server.sendLoggingMessage({
        level: "info",
        data: "Dev server started. Opening in browser...",
      })

      await openDevServerInBrowser()

      return {
        content: [
          {
            type: "text",
            text: restartDevServerToolSuccessResponse({
              localUrl,
              networkUrls,
            }),
          },
        ],
      }
    }
  )
}
