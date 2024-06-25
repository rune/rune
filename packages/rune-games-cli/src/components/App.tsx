import { Text } from "ink"
import React from "react"

export function App() {
  const text =
    "🥳 Rune is now Dusk! Please switch to dusk-cli. `npx dusk-cli@latest`."

  return <Text color="green">{text}</Text>
}
