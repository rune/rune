export const checkDevServerToolDescription = `Check if the Rune game development server is currently running.
If the server is running, it will provide the local and network URLs for accessing the game, as
well as the current project path. If the server is not running, it will provide instructions on how to start it.

AGENT INSTRUCTIONS:
Use this tool when the user wants to check if their game's development server is running.
This can be helpful to diagnose issues or to determine if a server needs to be started.

Common use cases:
- When the user asks if their server is running
- When the user reports issues accessing their game
- Before suggesting to restart or start a dev server`

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

  return `The development server is currently running.

You can access your game at:
- Local (desktop): ${localUrl}
- Network (desktop/mobile): 
${networkUrlsText}

The network URLs work for both desktop and mobile devices on the same local network. If one URL doesn't work, try another.`
}

export const checkDevServerToolNotRunningResponse = `The development server is not currently running.

To start the server:
1. If you create a new game with the "create-rune-game" command, the server should start automatically.
2. If the server has stopped, you can restart it with the "restart-dev-server" command.
3. If you're in a different project, provide the path when restarting: "restart-dev-server --projectPath=/path/to/project".`
