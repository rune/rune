import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { isLoggedIn } from "../services/login.js"
import { logError } from "../services/logging.js"
import {
  listRuneGamesToolDescription,
  notLoggedInResponse,
  listGamesResponse,
} from "../text/listRuneGamesToolText.js"
import { getGames } from "../services/game.js"

export const listRuneGamesTool = (server: McpServer) => {
  server.tool("list-rune-games", listRuneGamesToolDescription, {}, async () => {
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

    if (!loggedIn) {
      server.server.sendLoggingMessage({
        level: "warning",
        data: "User is not logged in. Redirecting to login tool.",
      })
      return {
        content: [
          {
            type: "text",
            text: notLoggedInResponse,
          },
        ],
      }
    }

    // User is logged in, fetch their games
    server.server.sendLoggingMessage({
      level: "info",
      data: "User is logged in. Fetching games...",
    })

    try {
      const games = await getGames()

      // Format the games list
      const gamesListText = games
        .map(
          (game, i) =>
            `${i + 1}. ${game.title} (latestVersion: ${game.latestVersionStatus})`
        )
        .join("\n")

      server.server.sendLoggingMessage({
        level: "info",
        data: `Found ${games.length} games for user`,
      })

      return {
        content: [
          {
            type: "text",
            text: listGamesResponse(games),
          },
        ],
      }
    } catch (error) {
      logError(server, error, "Error fetching games")
      return {
        content: [
          {
            type: "text",
            text: `An error occurred while trying to fetch your games: ${error instanceof Error ? error.message : "Unknown error"}`,
          },
        ],
      }
    }
  })
}
