import { client } from "../../apollo/client.js"
import {
  CreateGameVersionDocument,
  CreateGameVersionMutationVariables,
} from "../../generated/types.js"

/**
 * Creates a new game version on the Rune platform
 * @param variables The variables needed to create a game version
 * @returns A promise that resolves to the created game version data
 */
export async function createGameVersion(
  variables: CreateGameVersionMutationVariables
) {
  const { data, errors } = await client.mutate({
    mutation: CreateGameVersionDocument,
    variables,
  })

  if (errors && errors.length > 0) {
    throw errors[0]
  }

  if (!data) {
    throw new Error("No data returned from createGameVersion mutation")
  }

  return {
    newGameVersionId: data.createGameVersion.gameVersion.gameVersionId,
    previewLink: data.createGameVersion.previewLink,
    congratulationMsg: data.createGameVersion.congratulationMsg,
  }
}
