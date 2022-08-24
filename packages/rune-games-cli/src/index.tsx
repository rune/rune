#!/usr/bin/env node

import { ApolloProvider } from "@apollo/client/index.js"
import { render } from "ink"
import React from "react"

import { client } from "./apollo/client.js"
import { App } from "./components/App.js"

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
