import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { createGameTool } from "./tools/createGameTool.js"
import { restartDevServerTool } from "./tools/restartDevServerTool.js"
import { checkDevServerTool } from "./tools/checkDevServerTool.js"
import { checkProjectErrorsTool } from "./tools/checkProjectErrorsTool.js"
import { explainRuneProjectTool } from "./tools/explainRuneProjectTool.js"
import { stopDevServer } from "./services/devServer.js"
import { ServerCapabilities } from "@modelcontextprotocol/sdk/types.js"

const capabilities: ServerCapabilities = {
  tools: {},
  logging: {},
}

// Create server instance
const server = new McpServer(
  {
    name: "rune-mcp",
    version: "1.0.0",
    capabilities,
  },
  {
    capabilities,
  },
)

// Register all tools
createGameTool(server)
restartDevServerTool(server)
checkDevServerTool(server)
checkProjectErrorsTool(server)
explainRuneProjectTool(server)

// Handle graceful shutdown
const handleShutdown = async (signal: string) => {
  server.server.sendLoggingMessage({
    level: "warning",
    data: `Received ${signal}, shutting down gracefully...`,
  })

  try {
    // Stop the dev server first
    await stopDevServer()
    server.server.sendLoggingMessage({
      level: "info",
      data: "Dev server stopped",
    })

    // Close the MCP server connection if needed
    // This depends on if the McpServer has a close/disconnect method

    server.server.sendLoggingMessage({
      level: "info",
      data: "MCP server stopped",
    })
  } catch (error) {
    server.server.sendLoggingMessage({
      level: "error",
      data: error,
    })
  }

  // Exit with success code
  process.exit(0)
}

// Register shutdown handlers
process.on("SIGINT", () => handleShutdown("SIGINT")) // Ctrl+C
process.on("SIGTERM", () => handleShutdown("SIGTERM")) // Termination request
process.on("SIGHUP", () => handleShutdown("SIGHUP")) // Terminal closed

// Handle uncaught exceptions and unhandled promise rejections to ensure graceful shutdown
process.on("uncaughtException", async (error) => {
  server.server.sendLoggingMessage({
    level: "error",
    data: error,
  })
  await handleShutdown("uncaughtException")
})

process.on("unhandledRejection", async (reason) => {
  server.server.sendLoggingMessage({
    level: "error",
    data: reason,
  })
  await handleShutdown("unhandledRejection")
})

// Initialize and run the server
const main = async () => {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  server.server.sendLoggingMessage({
    level: "info",
    data: "Rune MCP Server started",
  })
}

main().catch((error) => {
  console.error("Fatal error in main():", error)
  process.exit(1)
})
