import { client } from "../../apollo/client.js"
import {
  CreateGameDocument,
  CreateGameInput,
  GameType,
} from "../../generated/types.js"

/**
 * Creates a new game on the Rune platform
 * @param game The game data to create
 * @returns A promise that resolves to the created game's ID
 */
export async function createGame(
  game: Pick<CreateGameInput, "title" | "description">
): Promise<number> {
  const { data, errors } = await client.mutate({
    mutation: CreateGameDocument,
    variables: { game: { ...game, type: GameType.MULTIPLAYER } },
  })

  if (errors && errors.length > 0) {
    throw errors[0]
  }

  if (!data) {
    throw new Error("No data returned from createGame mutation")
  }

  return data.createGame.game.id
}
