import { gql } from "@apollo/client/index.js"

import { client } from "../apollo/client.js"
import {
  CurrentCheckpointDocument,
  UploadCheckpointDocument,
  UploadCheckpointMutationVariables,
} from "../generated/types.js"

export async function uploadCheckpoint(
  variables: UploadCheckpointMutationVariables
) {
  const { data } = await client.mutate({
    mutation: UploadCheckpointDocument,
    variables,
  })
  if (!data) throw new Error("The upload returned no result")
  return data.uploadCheckpoint
}

gql`
  mutation UploadCheckpoint(
    $gameKey: String!
    $content: Upload!
    $base: String
    $release: Boolean
  ) {
    uploadCheckpoint(
      gameKey: $gameKey
      content: $content
      base: $base
      release: $release
    ) {
      commitHash
      previewLink
      gameVersion {
        gameId
        gameVersionId
      }
    }
  }
`

export async function fetchCurrentCheckpoint(gameKey: string) {
  const { data } = await client.query({
    query: CurrentCheckpointDocument,
    variables: { gameKey },
    fetchPolicy: "network-only",
  })
  return data.currentCheckpoint
}

gql`
  query CurrentCheckpoint($gameKey: String!) {
    currentCheckpoint(gameKey: $gameKey)
  }
`
