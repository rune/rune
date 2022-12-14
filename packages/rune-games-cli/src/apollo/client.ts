import { ApolloClient, InMemoryCache } from "@apollo/client/index.js"

import { contextLink } from "./contextLink.js"
import { uploadLink } from "./uploadLink.js"

export const client = new ApolloClient({
  link: contextLink.concat(uploadLink),
  cache: new InMemoryCache(),
})
