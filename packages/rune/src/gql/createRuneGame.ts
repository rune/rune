import { gql } from "@apollo/client/index.js"

import { client } from "../apollo/client.js"
import { CreateRuneGameDocument } from "../generated/types.js"

export async function createRuneGame(title: string, description: string) {
  const { data } = await client.mutate({
    mutation: CreateRuneGameDocument,
    variables: { title, description },
  })
  if (!data) throw new Error("Creating the game returned no result")
  return data.createRuneGame
}

gql`
  mutation CreateRuneGame($title: String!, $description: String!) {
    createRuneGame(title: $title, description: $description) {
      gameKey
      editorLink
    }
  }
`
