export const restartDevServerToolDescription = `Start restart the Rune game development server.

AGENT INSTRUCTIONS:
You should only use this tool if the user specifically asks to restart the development server or if the server has crashed.
The development server automatically detects and applies code changes while running, so there is typically NO NEED to restart 
the server when making changes to the game code.

Common situations where restart might be needed:
- If the development server has crashed
- If the user explicitly requests a restart
- If the user has changed configuration files that require a server restart

In all other cases, advise the user that the server will automatically detect their code changes without needing a restart.`

export const projectPathParameterDescription = `Path to the game project directory. 
If not specified, will use the most recently created game. If no game was created
since this MPC was started, you must specify this parameter in order to restart the server.`

export const restartDevServerToolResponse = ({
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

  return `Development server has been restarted successfully and a browser window should have 
been opened automatically.
      
While the server is running you can access your game at:
- Local (desktop): ${localUrl}
- Network (desktop/mobile): 
${networkUrlsText}

The network URLs work for both desktop and mobile devices on the same local network. If one URL doesn't work, try another.

Note: The development server automatically detects code changes. You typically don't need to restart 
the server when modifying your game code.`
}

export const noProjectPathErrorMessage = `No project path specified. 
Run this command again and provide a valid projectPath parameter.`
