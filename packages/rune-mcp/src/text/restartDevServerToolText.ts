export const restartDevServerToolDescription = `Restarts the Rune game development server.

AGENT INSTRUCTIONS:
Use when user wants to:
- Restart a stopped development server
- Refresh the development environment after changes
- Fix development server issues`

export const projectPathParameterDescription =
  "Path to the Rune game project to serve. Defaults to current workspace directory."

export const restartDevServerToolStartingResponse = `Starting the development server...
This may take a few seconds.`

export const restartDevServerToolSuccessResponse = ({
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

  return `Development server started successfully.

Access your game at:
- Local (desktop): ${localUrl}
- Network (desktop/mobile): 
${networkUrlsText}

Network URLs work on devices on same local network. Try another if one doesn't work.`
}

export const noProjectPathErrorMessage = `No project path specified. 
Run this command again and provide a valid projectPath parameter.`
