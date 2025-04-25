import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import {
  alreadyLoggedInResponse,
  emailParameterDescription,
  emailRequiredResponse,
  loginErrorResponse,
  loginToolDescription,
  loginToolInitiatingResponse,
  resendEmailParameterDescription,
  verificationInProgressResponse,
  verificationSuccessResponse,
} from "../text/loginToolText.js"
import { z } from "zod"
import {
  checkAuthToken,
  sendVerificationEmail,
  isLoggedIn,
  isVerificationInProgress,
} from "../services/login.js"
import { logError } from "../services/logging.js"

export const loginTool = (server: McpServer) => {
  server.tool(
    "login-to-rune",
    loginToolDescription,
    {
      email: z.string().email().optional().describe(emailParameterDescription),
      resendEmail: z
        .boolean()
        .default(false)
        .describe(resendEmailParameterDescription),
    },
    async ({ email: rawEmail, resendEmail }) => {
      server.server.sendLoggingMessage({
        level: "info",
        data: "Checking if user is logged in...",
      })

      let loggedIn = false
      try {
        loggedIn = await isLoggedIn()
      } catch (error) {
        logError(server, error, "Error checking if logged in")
      }

      if (loggedIn) {
        server.server.sendLoggingMessage({
          level: "info",
          data: "User is already logged in",
        })
        return {
          content: [
            {
              type: "text",
              text: alreadyLoggedInResponse,
            },
          ],
        }
      }

      const email = rawEmail?.toLowerCase().trim()

      // Email is required to start or resend the verification process
      if (!email) {
        server.server.sendLoggingMessage({
          level: "warning",
          data: "No email provided for login",
        })
        return {
          content: [
            {
              type: "text",
              text: emailRequiredResponse,
            },
          ],
        }
      }

      // If resendEmail is true, directly send a new verification email
      // regardless of whether verification is in progress
      if (resendEmail || !isVerificationInProgress(email)) {
        server.server.sendLoggingMessage({
          level: "info",
          data: `Resending verification email to: ${email}`,
        })

        try {
          await sendVerificationEmail(email)

          server.server.sendLoggingMessage({
            level: "info",
            data: `Verification email resent to ${email}`,
          })

          return {
            content: [
              {
                type: "text",
                text: loginToolInitiatingResponse(email),
              },
            ],
          }
        } catch (error) {
          logError(server, error, "Error resending verification email")
          return {
            content: [
              {
                type: "text",
                text: loginErrorResponse,
              },
            ],
          }
        }
      }

      // Check if user has clicked the verification link
      const authorized = await checkAuthToken()

      if (authorized) {
        server.server.sendLoggingMessage({
          level: "info",
          data: "User has completed verification",
        })
        return {
          content: [
            {
              type: "text",
              text: verificationSuccessResponse,
            },
          ],
        }
      }

      // Verification is in progress but not completed
      server.server.sendLoggingMessage({
        level: "info",
        data: "Verification in progress but not completed yet",
      })
      return {
        content: [
          {
            type: "text",
            text: verificationInProgressResponse,
          },
        ],
      }
    }
  )
}
