import { client } from "../../apollo/client.js"
import {
  StartVerificationDocument,
  StartVerificationMutationVariables,
} from "../../generated/types.js"

export async function queryVerificationToken(
  variables: StartVerificationMutationVariables
) {
  const { data, errors } = await client.mutate({
    mutation: StartVerificationDocument,
    variables,
  })

  if (errors && errors.length > 0) {
    throw errors[0]
  }

  return {
    verificationToken: data?.startVerification.verificationToken,
  }
}
