export const projectPathParameterDescription =
  "Path to the Rune game project directory to upload."

export const isReadyForReleaseParameterDescription = `Whether the game is ready for public release.

AGENT INSTRUCTIONS:
Confirm with user before setting to true. If true, Rune team will review for publishing.
If false, uploads as draft visible only to the developer in the Rune app.`

export const redirectToLoginToolResponse = `You need to be logged in to upload a Rune game.
Please use the login-to-rune tool first with your email address to authenticate.`

export const projectPathInvalid = (projectPath: string) =>
  `Project directory not found: ${projectPath}. Check the path and try again.`

export const projectValidationFailed = (error: string) =>
  `Project validation failed: ${error}. Fix the issues and try again.`

export type UploadSuccessResponseParams = {
  gameId: number
  newGameVersionId?: number
  previewLink?: string
  congratulationMsg: string | null
}

export const uploadDraftSuccessResponse = ({
  gameId,
  previewLink,
}: {
  gameId: number
  previewLink: string
}) =>
  `Successfully uploaded game draft (ID: ${gameId}).
You can preview it here: ${previewLink}
Your game is now available as a draft in the Rune app.
Find it under "All Games" after refreshing the games list.
To share it with others, use the upload-existing-rune-game tool with isReadyForRelease=true.`

export const uploadReleaseSuccessResponse = ({
  gameId,
  previewLink,
}: {
  gameId: number
  previewLink: string
}) =>
  `Successfully uploaded game for release (ID: ${gameId}).
The Rune team will review it shortly.
Once approved, your game will be available to all users on the Rune app.
You can preview it here: ${previewLink}`
