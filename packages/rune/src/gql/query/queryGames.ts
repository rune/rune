import { client } from "../../apollo/client.js"
import { GamesDocument } from "../../generated/types.js"

/**
 * Queries for games data outside of React context
 * @returns Promise resolving to games data
 */
export async function queryGames() {
  const { data, error } = await client.query({
    query: GamesDocument,
  })

  if (error) {
    throw error
  }

  return {
    games: data?.games?.nodes,
  }
}
