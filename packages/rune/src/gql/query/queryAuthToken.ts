import { client } from "../../apollo/client.js"
import {
  CheckVerificationDocument,
  CheckVerificationMutationVariables,
} from "../../generated/types.js"

/**
 * Performs the CheckVerification mutation outside of React context
 * @param variables The verification token to check
 * @returns Promise with the auth token if verification was successful
 */
export async function queryAuthToken(
  variables: CheckVerificationMutationVariables
) {
  const { data, errors } = await client.mutate({
    mutation: CheckVerificationDocument,
    variables,
  })

  if (errors && errors.length > 0) {
    throw errors[0]
  }

  return {
    authToken: data?.checkVerification.authToken,
  }
}
