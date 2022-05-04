import { Text, Box } from "ink"
import React from "react"

import { cli } from "../App/cli.js"

export function ErrorText({
  showHelp,
  children,
}: {
  showHelp?: boolean
  children: string | string[]
}) {
  return (
    <>
      <Box paddingLeft={2} paddingTop={1} paddingBottom={showHelp ? 0 : 1}>
        <Text color="red">Error: {children}</Text>
      </Box>
      {showHelp && <Text color="red">{cli.help}</Text>}
    </>
  )
}
