/** Description of the usage of the create-rune-game tool. */
export const createGameToolDescription = `Creates a new multiplayer, mobile game project using the Rune SDK.

AGENT INSTRUCTIONS:
Before calling this tool, please prompt the user for each parameter needed.
You should use a conversational style to ask the user for this information, and just
ask them for one parameter at a time. If you are able to infer the parameter's value from
the user's previous input, you can just ask them to confirm the value you have inferred.`

/** Description of the game type parameter */
export const gameTypeParameterDescription = `This should be the type of game the user wants to create, for example:

- puzzle game
- 2D Platformer
- turn based strategy
- card game
- board game
- 3D racing game
- Side Scr

This could also be the name of a specific game, such as:

- Chess
- Go
- Battleship
- Risk
- Baseball

AGENT INSTRUCTIONS: 
If the user has already specified the type of game they want to create, 
you should not ask them again and just ask them to confirm you have identified the game type 
correctly from their input.`

/** Description of the game template parameter */
export const gameTemplateParameterDescription = `These are the available game templates that
The Rune SDK will create a starter project for the user with. 

AGENT INSTRUCTIONS:
If you are unsure what game template to use, ask the user for the type of game they want to create.
However you may be able to infer the game template from the game type they have specified.
For example, if they describe a game that has a lot of different screens, buttons or dense 
information, then you might suggest the typescript template that includes React. If the
game has minimal UI or is primarily graphics based, then you might suggest the typescript template.`

export const workspaceDirectoryParameterDescription = `This is the directory where the game project will be created.

AGENT INSTRUCTIONS:
You do not need to ask the user for this parameter. Instead you should just default it to the current working directory.
If the user has specified a different directory, you can ask them to confirm it.
`

export const createProjectInNewDirectoryParameterDescription = `This specifies whether the game project files should be written
to a new directory in the workspace or if the files should be written to the workspace directory itself.

AGENT INSTRUCTIONS:
You do not need to ask the user for this parameter. Instead you should check if the current workspace 
directory is empty or empty aside from a .vscode directory. If it is, then you should default this parameter to false.
Otherwise, you should default it to true.
Additionally, if the user has specified a different directory, you can ask them to confirm it.`

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

  return `Created a new Rune game project at ${pathToProject} using the ${gameTemplate} template.
All dependencies and devDependencies have been installed.
The game that was created is a simple Tic Tac Toe game that you can now change to any game you want.
The game is running on a local development server. A browser window should have opened automatically
and you can also access it at the following URLs:

- Local (desktop): ${localUrl}
- Network (desktop/mobile): 
${networkUrlsText}

The network URLs work for both desktop and mobile devices on the same local network. If one URL doesn't work, try another.
`
}
