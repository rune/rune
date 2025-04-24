import { client } from "../../apollo/client.js"
import { MeDocument } from "../../generated/types.js"
import { getAuthTokenFromStorage } from "../../lib/login.js"
import { storage } from "../../lib/storage/storage.js"

/**
 * Fetches information about the current developer.
 */
export async function queryMe() {
  if (!getAuthTokenFromStorage()) {
    throw new Error("Not logged in")
  }

  const { data, error } = await client.query({
    query: MeDocument,
  })

  if (error) {
    if (error.message.includes("[tango][AUTH_FAILED]")) {
      storage.delete("authToken")
    }
    throw error
  }

  return {
    me: data?.me,
  }
}
