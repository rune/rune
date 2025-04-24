import { Game } from "../services/game.js"

export const listRuneGamesToolDescription = `This tool lists all games you have uploaded to the Rune platform.
It will show you the title, ID, and status of each game.`

export const notLoggedInResponse = `
You need to be logged in to view your Rune games.
Please use the login-to-rune tool first with your email address to authenticate.
`

export const noGamesFoundResponse = `
You don't have any games uploaded to the Rune platform yet.
Use the upload-rune-game tool to upload your first game.
`

export const listGamesResponse = (games: Game[]) =>
  games.length > 0
    ? `Here are your games on the Rune platform:
${games.map((game) => `- ${game.title} (latestVersion: ${game.latestVersionStatus})`).join("\n")}`
    : "You don't have any games uploaded to the Rune platform yet. Use the upload-rune-game tool to upload your first game."
