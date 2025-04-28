/** Description of the usage of the create-rune-game tool. */
export const createGameToolDescription = `Creates a new multiplayer mobile game project using the Rune SDK.

AGENT INSTRUCTIONS:
Ask for missing parameters conversationally. Infer values from previous input when possible and ask for confirmation.`

/** Description of the game type parameter */
export const gameTypeParameterDescription = `The type or name of game to create (e.g., puzzle game, 2D platformer, chess, card game).

AGENT INSTRUCTIONS: 
If the user has already specified a game type, confirm it rather than asking again.`

/** Description of the game template parameter */
export const gameTemplateParameterDescription = `Available starter templates for Rune SDK project creation.

AGENT INSTRUCTIONS:
Suggest typescript-react for games with complex UI/multiple screens. Suggest typescript for graphics-focused games with minimal UI.`

export const workspaceDirectoryParameterDescription = `Directory where the game project will be created.

AGENT INSTRUCTIONS:
Default to current working directory. Confirm if user specifies a different location.`

export const createProjectInNewDirectoryParameterDescription = `Whether to create a new subdirectory for the game or use the workspace directory directly.

AGENT INSTRUCTIONS:
Default to false if workspace is empty (except .vscode). Default to true otherwise. Confirm if user has other preferences.`

export const createGameToolResponse = ({
  pathToProject,
  gameTemplate,
  localUrl,
  networkUrls,
}: {
  pathToProject: string
  gameTemplate: string
  localUrl: string
  networkUrls: string[]
}) => {
  const networkUrlsText =
    networkUrls.length > 0
      ? networkUrls.map((url, index) => `  ${index + 1}. ${url}`).join("\n")
      : "  No network URLs available"

  return `Successfully created Rune game at ${pathToProject} using ${gameTemplate} template.
Dependencies installed and dev server running.
The game created is a simple Tic Tac Toe game for two players. Modify it to match your game type.
Access your game at:

- Local (desktop): ${localUrl}
- Network (desktop/mobile): 
${networkUrlsText}

Network URLs work for devices on the same local network. Try another if one doesn't work.`
}
