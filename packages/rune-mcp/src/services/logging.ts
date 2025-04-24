import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

/**
 * Utility function to properly log error details from catch blocks
 * @param server The MCP server instance
 * @param error The caught error object
 * @param message A descriptive message about the context of the error
 */
export function logError(
  server: McpServer,
  error: unknown,
  message: string
): void {
  server.server.sendLoggingMessage({
    level: "error",
    data: {
      message,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
    },
  })
}
