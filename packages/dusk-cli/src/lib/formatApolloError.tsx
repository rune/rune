import { ApolloError } from "@apollo/client/index.js"

export function formatApolloError(
  error: ApolloError,
  messages: { [key: string]: string; default: string }
) {
  for (const key of Object.keys(messages)) {
    if (error.message.includes(key)) return messages[key] as string
  }

  return (process.env.STAGE ?? "production") === "production"
    ? messages.default
    : [messages.default, `Error details: ${JSON.stringify(error)}`].join("\n")
}
