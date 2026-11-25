import type { ApolloError } from "@apollo/client/index.js"

import { formatApolloError } from "./formatApolloError.js"

const isApolloError = (error: unknown): error is ApolloError =>
  error instanceof Error && "graphQLErrors" in error

export function apiErrorCode(error: unknown) {
  if (!isApolloError(error)) return undefined
  return error.graphQLErrors[0]?.message.match(/^\[tango\]\[(\w+)\]/)?.[1]
}

// The API sends refusals as "[tango][CODE] message" and masks anything else
// to a bare "[tango][UNEXPECTED_ERR]".
export function apiErrorMessage(error: unknown) {
  if (!isApolloError(error)) {
    return error instanceof Error ? error.message : String(error)
  }
  const serverMessage = error.graphQLErrors[0]?.message.match(
    /^\[tango\]\[\w+\] ([\s\S]+)$/
  )?.[1]

  return (
    serverMessage ??
    formatApolloError(error, {
      "[tango][GAME_NOT_FOUND]":
        "Game not found, or you're not one of its developers.",
    })
  )
}
