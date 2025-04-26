import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import { exec, ExecException } from "child_process"
import { promisify } from "util"
import fs from "fs"
import path from "path"
import {
  checkProjectErrorsToolDescription,
  checkProjectErrorsFound,
  checkProjectErrorsNoneFound,
  checkProjectErrorsScriptNotFound,
  projectPathParameterDescription,
  CheckErrorsOutput,
} from "../text/checkProjectErrorsText.js"
import { logError } from "../services/logging.js"

const execPromise = promisify(exec)

/**
 * Check if a script exists in the project's package.json
 */
const scriptExists = (packageJsonPath: string, scriptName: string): boolean => {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"))
    return !!packageJson.scripts && !!packageJson.scripts[scriptName]
  } catch {
    return false
  }
}

const isExecException = (error: unknown): error is ExecException => {
  return (
    typeof error === "object" &&
    error !== null &&
    "cmd" in error &&
    "killed" in error &&
    "code" in error &&
    "signal" in error
  )
}

/**
 * Extract error output from exec exceptions
 */
const getErrorOutput = (error: unknown): string => {
  if (isExecException(error)) {
    // Check if it's an ExecException with stderr/stdout

    return error.stderr || error.stdout || String(error)
  }
  return String(error)
}

/**
 * Register the check project errors tool with the MCP server
 */
export const checkProjectErrorsTool = (server: McpServer): void => {
  server.tool(
    "check-rune-project-errors",
    checkProjectErrorsToolDescription,
    {
      projectPath: z.string().describe(projectPathParameterDescription),
    },
    async ({ projectPath }) => {
      // Send notification that check is starting
      server.server.sendLoggingMessage({
        level: "info",
        data: "Starting project error check...",
      })

      // Verify the project path exists and is valid
      if (!fs.existsSync(projectPath)) {
        throw new Error(`Project directory not found: ${projectPath}`)
      }

      // Check if it has a package.json
      const packageJsonPath = path.join(projectPath, "package.json")
      if (!fs.existsSync(packageJsonPath)) {
        throw new Error(`package.json not found in ${projectPath}`)
      }

      try {
        // Track errors from both commands
        const errors: Array<CheckErrorsOutput> = []

        // First check if typecheck script exists
        const typecheckExists = scriptExists(packageJsonPath, "typecheck")
        if (!typecheckExists) {
          server.server.sendLoggingMessage({
            level: "error",
            data: "Typecheck script not found in package.json",
          })

          return {
            content: [
              {
                type: "text",
                text: checkProjectErrorsScriptNotFound("typecheck"),
              },
            ],
          }
        }

        // Now check if lint script exists
        const lintExists = scriptExists(packageJsonPath, "lint")
        if (!lintExists) {
          server.server.sendLoggingMessage({
            level: "error",
            data: "Lint script not found in package.json",
          })

          return {
            content: [
              {
                type: "text",
                text: checkProjectErrorsScriptNotFound("lint"),
              },
            ],
          }
        }

        // Change to the project directory for all commands
        process.chdir(projectPath)

        // Run the typecheck command
        server.server.sendLoggingMessage({
          level: "info",
          data: "TypeScript check started",
        })

        try {
          const typecheckResult = await execPromise("npm run typecheck", {
            timeout: 60000,
          })

          // If we get here, typecheck passed with no errors
          server.server.sendLoggingMessage({
            level: "info",
            data: `TypeScript check passed ${typecheckResult.stdout}`,
          })
        } catch (typecheckError) {
          // Typecheck found errors
          const errorOutput = getErrorOutput(typecheckError)

          server.server.sendLoggingMessage({
            level: "error",
            data: `TypeScript errors: ${errorOutput}`,
          })

          errors.push({ type: "typescript", output: errorOutput })
        }

        // Run the lint command
        server.server.sendLoggingMessage({
          level: "info",
          data: "ESLint check started",
        })

        try {
          const lintResult = await execPromise("npm run lint -- --fix", {
            timeout: 60000,
          })

          // If we get here, lint passed with no errors
          server.server.sendLoggingMessage({
            level: "info",
            data: `ESLint check passed ${lintResult.stdout}`,
          })
        } catch (lintError) {
          // Lint found errors
          const errorOutput = getErrorOutput(lintError)

          server.server.sendLoggingMessage({
            level: "error",
            data: `ESLint errors: ${errorOutput}`,
          })

          errors.push({ type: "eslint", output: errorOutput })
        }

        // Return appropriate response based on the collected errors
        if (errors.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: checkProjectErrorsNoneFound,
              },
            ],
          }
        } else {
          // Generate response with all errors

          return {
            content: [
              {
                type: "text",
                text: checkProjectErrorsFound(errors),
              },
            ],
          }
        }
      } catch (error) {
        // Handle general errors
        logError(server, error, "Error checking project for errors")
        throw error
      }
    }
  )
}
