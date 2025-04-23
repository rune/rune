import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import fs from "fs"
import path from "path"
import {
  explainRuneProjectToolDescription,
  projectPathParameterDescription,
  projectNotFoundError,
  notRuneProjectError,
  explainProjectResponse,
} from "../text/explainRuneProjectToolText.js"
import { addCopilotInstructions } from "../services/instructions.js"

/**
 * Check if a file exists in the project
 */
const fileExists = (projectPath: string, relativePath: string): boolean => {
  return fs.existsSync(path.join(projectPath, relativePath))
}

/**
 * Attempt to find an important file in common locations
 */
const findFile = (projectPath: string, possiblePaths: string[]): string | null => {
  for (const filePath of possiblePaths) {
    if (fileExists(projectPath, filePath)) {
      return filePath
    }
  }
  return null
}

/**
 * Check if package.json has a specific dependency
 */
const hasDependency = (packageJsonPath: string, dependencyName: string): boolean => {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"))
    const allDependencies = {
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {}),
    }
    return !!allDependencies[dependencyName]
  } catch {
    return false
  }
}

/**
 * Register the explainRuneProject tool with the MCP server
 */
export const explainRuneProjectTool = (server: McpServer): void => {
  server.tool(
    "explain-rune-project",
    explainRuneProjectToolDescription,
    {
      projectPath: z.string().describe(projectPathParameterDescription),
    },
    async ({ projectPath }) => {
      // Send notification that analysis is starting
      server.server.sendLoggingMessage({
        level: "info",
        data: "Analyzing your Rune project structure...",
      })

      // Verify the project path exists and is valid
      if (!fs.existsSync(projectPath)) {
        server.server.sendLoggingMessage({
          level: "error",
          data: `Project directory not found: ${projectPath}`,
        })
        return {
          content: [
            {
              type: "text",
              text: projectNotFoundError(projectPath),
            },
          ],
        }
      }

      // Check if it has a package.json
      const packageJsonPath = path.join(projectPath, "package.json")
      if (!fs.existsSync(packageJsonPath)) {
        server.server.sendLoggingMessage({
          level: "error",
          data: "package.json not found in the project",
        })
        return {
          content: [
            {
              type: "text",
              text: notRuneProjectError,
            },
          ],
        }
      }

      try {
        // Check if this is a Rune project by looking for rune-sdk dependency
        const isRuneProject = hasDependency(packageJsonPath, "rune-sdk")
        if (!isRuneProject) {
          server.server.sendLoggingMessage({
            level: "error",
            data: "Not a Rune project: rune-games-sdk dependency not found",
          })
          return {
            content: [
              {
                type: "text",
                text: notRuneProjectError,
              },
            ],
          }
        }

        server.server.sendLoggingMessage({
          level: "info",
          data: "Adding copilot instructions to the project",
        })

        const copilotInstructionsAdded = await addCopilotInstructions(projectPath)

        if (copilotInstructionsAdded) {
          server.server.sendLoggingMessage({
            level: "info",
            data: "Copilot instructions added",
          })
        } else {
          server.server.sendLoggingMessage({
            level: "warning",
            data: "Copilot instructions file already exists so no additional instructions for Rune were added",
          })
        }

        // Try to determine the project structure
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"))
        const projectName = packageJson.name || path.basename(projectPath)

        // Determine language (TypeScript or JavaScript)
        const isTypeScript =
          hasDependency(packageJsonPath, "typescript") || fileExists(projectPath, "tsconfig.json")

        // Check for UI frameworks
        const hasReact = hasDependency(packageJsonPath, "react")
        const hasSvelte = hasDependency(packageJsonPath, "svelte")
        const hasVue = hasDependency(packageJsonPath, "vue")
        const hasPixi = hasDependency(packageJsonPath, "pixi.js")

        // Find main game logic file
        const potentialLogicFiles = [
          isTypeScript ? "src/logic.ts" : "src/logic.js",
          "logic.ts",
          "logic.js",
          "src/logic/index.ts",
          "src/logic/index.js",
        ]
        const logicFilePath =
          findFile(projectPath, potentialLogicFiles) || "src/logic.js (not found)"

        // Find client/UI file
        const clientExtension = isTypeScript ? ".ts" : ".js"
        const reactExtension = isTypeScript ? ".tsx" : ".jsx"

        const potentialClientFiles = [
          `src/client${clientExtension}`,
          `client${clientExtension}`,
          hasReact ? `src/client${reactExtension}` : "",
          hasReact ? `client${reactExtension}` : "",
          hasReact ? `src/App${reactExtension}` : "",
          hasSvelte ? "src/App.svelte" : "",
          hasVue ? "src/App.vue" : "",
        ].filter(Boolean)

        const clientFilePath =
          findFile(projectPath, potentialClientFiles) || "src/client.js (not found)"

        // Find other important files
        const otherImportantFiles = []

        // Check for index.html
        const indexHtmlPath = findFile(projectPath, ["index.html", "public/index.html"])
        if (indexHtmlPath) otherImportantFiles.push(indexHtmlPath)

        // Check for CSS/styles
        const stylePath = findFile(projectPath, [
          "src/styles.css",
          "styles.css",
          "src/app.css",
          "app.css",
        ])
        if (stylePath) otherImportantFiles.push(stylePath)

        // Check for config files
        const configFiles = [
          "vite.config.js",
          "vite.config.ts",
          isTypeScript ? "tsconfig.json" : null,
          "rune.config.js",
        ].filter(Boolean)

        for (const configFile of configFiles) {
          if (configFile && fileExists(projectPath, configFile)) {
            otherImportantFiles.push(configFile)
          }
        }

        // Generate response
        const projectDetails = {
          name: projectName,
          isTypeScript,
          hasReact,
          hasSvelte,
          hasVue,
          hasPixi,
          logicFilePath,
          clientFilePath,
          otherImportantFiles,
        }

        server.server.sendLoggingMessage({
          level: "info",
          data: `Project analysis complete: ${JSON.stringify(projectDetails, null, 2)}`,
        })

        return {
          content: [
            {
              type: "text",
              text: explainProjectResponse(projectDetails),
            },
          ],
        }
      } catch (error) {
        // Handle errors
        const errorMessage = error instanceof Error ? error.message : String(error)

        server.server.sendLoggingMessage({
          level: "error",
          data: errorMessage,
        })

        throw error
      }
    },
  )
}
