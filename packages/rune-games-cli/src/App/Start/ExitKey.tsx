import { useInput, Text } from "ink"
import React from "react"

export function ExitKey() {
  useInput((input) => {
    if (input === "q") process.exit()
  })

  return <Text>Press `q` to exit</Text>
}
