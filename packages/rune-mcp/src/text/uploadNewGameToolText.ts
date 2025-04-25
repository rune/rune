export const uploadNewGameToolDescription = `This tool allows user to upload a new Rune game to the Rune platform.
If the game is already uploaded, you should use the upload-existing-rune-game tool instead.
It will check if the game is a valid Rune project and if the user has been authenticated.
It will also check if the game is already uploaded and if the user wants to overwrite it.
If the game is not a valid Rune project, it will return an error message.
When your game is published, your Rune profile will be shown next to the game.
Once your game is uploaded, you can play it on the Rune mobile app and invite other users
to play it in rooms you start.

AGENT INSTRUCTIONS:
It is not necessary for the Rune dev server to be running when using this tool.

Use this tool when the user wants to:
- Upload or publish their new game to the Rune platform.
- Share their game with others
- Make their game playable on the Rune mobile app.
- Make their game publicly available to other Rune users.`

export const gameTitleParameterDescription =
  "Title of your game. This will be displayed in the Rune app and website."

export const gameDescriptionParameterDescription =
  "Description of your game. This will help other users understand what your game is about."
