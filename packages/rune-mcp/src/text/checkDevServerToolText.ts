export const checkDevServerToolDescription = `Checks if the Rune game development server is running and provides access URLs.

AGENT INSTRUCTIONS:
Use when user wants to check server status, diagnose access issues, or before suggesting server restart.`

export const checkDevServerToolRunningResponse = ({
  localUrl,
  networkUrls,
}: {
  localUrl: string
  networkUrls: string[]
}) => {
  const networkUrlsText =
    networkUrls.length > 0
      ? networkUrls.map((url, index) => `  ${index + 1}. ${url}`).join("\n")
      : "  No network URLs available"

  return `Development server is running.

Access your game at:
- Local (desktop): ${localUrl}
- Network (desktop/mobile): 
${networkUrlsText}

Network URLs work on devices on same local network. Try another if one doesn't work.`
}

export const checkDevServerToolNotRunningResponse = `Development server is not running.

To start the server:
1. Create a new game with "create-rune-game" (starts server automatically)
2. Restart with "restart-dev-server" command
3. For different projects: "restart-dev-server --projectPath=/path/to/project"`
