export const projectPathParameterDescription =
  "Path to the Rune game project directory to upload."

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

export type UploadSuccessResponseParams = {
  gameId: number
  newGameVersionId?: number
  previewLink?: string
  congratulationMsg: string | null
}

export const uploadDraftSuccessResponse = (
  params: UploadSuccessResponseParams
) => {
  const { gameId, newGameVersionId, previewLink, congratulationMsg } = params

  let response = `Game has been uploaded as a draft. The Rune Game ID is ${gameId}.
Use this game id if you want to upload a new version of the game.
You should now be able to play the game on the Rune mobile app after refreshing the games list.
You can also publish the game later when it is ready for release.
You can always make updates to your game and upload a new version to replace the current
draft version.`

  if (newGameVersionId) {
    response += `\nGame version ID: ${newGameVersionId}`
  }

  if (previewLink) {
    response += `\nPreview link: ${previewLink}`
  }

  if (congratulationMsg) {
    response += `\n\n${congratulationMsg}`
  }

  return response
}

export const uploadReleaseSuccessResponse = (
  params: UploadSuccessResponseParams
) => {
  const { gameId, newGameVersionId, previewLink, congratulationMsg } = params

  let response = `Game has been uploaded and marked as ready for release. The Rune Game ID is ${gameId}.
Use this game id if you want to upload a new version of the game.
The Rune team will review the game and notify you when it is released or contact you
if there are any issues with your game that need to be fixed before it can be released.
You can always make updates to your game and upload a new version.`

  if (newGameVersionId) {
    response += `\nGame version ID: ${newGameVersionId}`
  }

  if (previewLink) {
    response += `\nPreview link: ${previewLink}`
  }

  if (congratulationMsg) {
    response += `\n\n${congratulationMsg}`
  }

  return response
}
