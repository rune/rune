import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import path from "path"
import {
  openDevServerInBrowser,
  startDevServer,
} from "../services/devServer.js"
import {
  createGameToolDescription,
  gameTemplateParameterDescription,
  gameTypeParameterDescription,
  createProjectInNewDirectoryParameterDescription,
  workspaceDirectoryParameterDescription,
  createGameToolResponse,
} from "../text/createGameToolText.js"

import { installDependenciesForProject } from "rune/lib/install.js"
import { createGameFromTemplate } from "rune/lib/create.js"
import { addCopilotInstructions } from "../services/instructions.js"

const gameTemplateEnumSchema = z.enum(["typescript", "typescript-react"])

/**
 * Register game template tools with the MCP server
 */
export const createGameTool = (server: McpServer): void => {
  // Tool for creating a new Rune game project
  server.tool(
    "create-rune-game",
    createGameToolDescription,
    {
      gameType: z.string().describe(gameTypeParameterDescription),
      gameTemplate: gameTemplateEnumSchema.describe(
        gameTemplateParameterDescription
      ),
      createProjectInNewDirectory: z
        .boolean()
        .describe(createProjectInNewDirectoryParameterDescription),
      workspaceDirectory: z
        .string()
        .describe(workspaceDirectoryParameterDescription),
    },
    async ({
      gameTemplate,
      createProjectInNewDirectory,
      workspaceDirectory,
      gameType,
    }) => {
      server.server.sendLoggingMessage({
        level: "info",
        data: "Creating a new Rune game project with type: " + gameType,
      })

      const gameDirectory = gameType
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")

      const targetDir = `${workspaceDirectory}/${createProjectInNewDirectory ? gameDirectory : ""}`

      const pathToProject = path.resolve(targetDir)

      await createGameFromTemplate({
        overwrite: false,
        targetDir,
        template: gameTemplate,
      })

      await addCopilotInstructions(pathToProject)

      server.server.sendLoggingMessage({
        level: "info",
        data: `Project created at ${pathToProject}. Now installing dependencies...`,
      })

      await installDependenciesForProject({ pathToProject })

      server.server.sendLoggingMessage({
        level: "info",
        data: "Dependencies installed. Starting dev server...",
      })

      const { localUrl, networkUrls } = await startDevServer({
        pathToProject,
        server,
      })

      server.server.sendLoggingMessage({
        level: "info",
        data: "Dev server started. Opening in browser...",
      })

      await openDevServerInBrowser()

      server.server.sendLoggingMessage({
        level: "info",
        data: "Done",
      })

      return {
        content: [
          {
            type: "text",
            text: createGameToolResponse({
              pathToProject,
              gameTemplate,
              localUrl,
              networkUrls,
            }),
          },
        ],
      }
    }
  )
}
