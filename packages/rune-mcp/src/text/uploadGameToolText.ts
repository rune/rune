export const uploadGameToolDescription = `This tool allows user to upload a Rune game to the Rune platform. 
It will check if the game is a valid Rune project and if the user has been authenticated.
It will also check if the game is already uploaded and if the user wants to overwrite it.
If the game is not a valid Rune project, it will return an error message.
When your game is published, your Rune profile will be shown next to the game.
Once your game is uploaded, you can play it on the Rune mobile app and invite other users
to play it in rooms you start.

AGENT INSTRUCTIONS:
It is not necessary for the Rune dev server to be running when using this tool.

Use this tool when the user wants to:
- Upload or publish their game to the Rune platform.
- Upload a new version of a game that has already been uploaded. 
- Share their game with others
- Make their game playable on the Rune mobile app.
- Make their game publicly available to other Rune users.`

export const projectPathParameterDescription =
  "Path to the Rune game project directory to upload."

export const emailParameterDescription =
  "Email address of the developer's Rune account."

export const isReadyForReleaseParameterDescription = `Boolean flag to indicate whether the game is ready for release.
AGENT INSTRUCTIONS:
Prompt the user to confirm if the game is ready for release before running this tool.
If the game is ready, the Rune team will review and publish it to the Rune platform
for all users to play.
If the game is not ready, you can upload it as a draft and publish it later. 
The user will be able to see their draft games in the Rune app under all games
by refreshing the games list after uploading.`

export const redirectToLoginToolResponse = `
You need to be logged in to upload a Rune game.
Please use the login-to-rune tool first with your email address to authenticate.`

export const projectPathInvalid = (projectPath: string) =>
  `Project directory not found or is not a directory: ${projectPath}.
Check the path and try again.`

export const projectValidationFailed = (error: string) =>
  `Project validation failed: ${error}. Please check the errors and try again.`

export const uploadDraftSuccessResponse = `Game has been uploaded as a draft.
You should now be able to play the game on the Rune mobile app after refreshing the games list.
You can also publish the game later when it is ready for release.
You can always make updates to your game and upload a new version to replace the current
draft version.`

export const uploadReleaseSuccessResponse = `Game has been uploaded and marked as ready for release.
The Rune team will review the game and notify you when it is released or contact you
if there are any issues with your game that need to be fixed before it can be released.
You can always make updates to your game and upload a new version.`
