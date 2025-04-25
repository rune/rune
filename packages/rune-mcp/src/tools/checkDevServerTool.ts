import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import {
  isDevServerRunning,
  getDevServerUrls,
  getCurrentProjectPath,
} from "../services/devServer.js"
import {
  checkDevServerToolDescription,
  checkDevServerToolRunningResponse,
  checkDevServerToolNotRunningResponse,
} from "../text/checkDevServerToolText.js"

/**
 * Register the check dev server tool with the MCP server
 */
export const checkDevServerTool = (server: McpServer): void => {
  server.tool(
    "check-rune-dev-server",
    checkDevServerToolDescription,
    {}, // No parameters needed for this tool
    async () => {
      server.server.sendLoggingMessage({
        level: "info",
        data: "Checking development server status...",
      })

      // Check if the dev server is running
      if (isDevServerRunning()) {
        // Get the server URLs
        const { localUrl, networkUrls } = getDevServerUrls()
        const projectPath = getCurrentProjectPath()

        server.server.sendLoggingMessage({
          level: "info",
          data: `Development server is running for project: ${projectPath}`,
        })

        return {
          content: [
            {
              type: "text",
              text: checkDevServerToolRunningResponse({
                localUrl,
                networkUrls,
              }),
            },
          ],
        }
      } else {
        server.server.sendLoggingMessage({
          level: "info",
          data: "Development server is not currently running",
        })

        return {
          content: [
            {
              type: "text",
              text: checkDevServerToolNotRunningResponse,
            },
          ],
        }
      }
    }
  )
}
