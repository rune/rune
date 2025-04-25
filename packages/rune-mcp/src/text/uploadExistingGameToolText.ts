export const uploadExistingGameToolDescription = `This tool allows user to upload a new version of a game to the Rune platform.
If the game has never been uploaded before, you should use the upload-new-rune-game tool instead. 
It will check if the game is a valid Rune project and if the user has been authenticated.
It will also check if the game is already uploaded and if the user wants to overwrite it.
If the game is not a valid Rune project, it will return an error message.
When your game is published, your Rune profile will be shown next to the game.
Once your game is uploaded, you can play it on the Rune mobile app and invite other users
to play it in rooms you start.

AGENT INSTRUCTIONS:
It is not necessary for the Rune dev server to be running when using this tool.

Use this tool when the user wants to:
- Upload a new version of a game that has already been uploaded. 
- Release a game they have already uploaded so that it can be played by other users on the Rune app.`

export const gameIdParameterDescription =
  "The ID of the existing game on the Rune platform that you want to update with a new version."
