import { Box } from "ink"
import React, { ReactNode, useState } from "react"

import { Login } from "../flows/Login.js"
import { useMe } from "../gql/useMe.js"

import { Step } from "./Step.js"

export function LoginGate({ children }: { children: ReactNode }) {
  const { me } = useMe()

  const [isRegistering, setIsRegistering] = useState(false)

  if (!me?.handle || isRegistering) {
    return <Login setIsRegistering={setIsRegistering} />
  }

  return (
    <Box flexDirection="column">
      <Step
        status="success"
        label={`Logged in as \`${me.handle}\` (${me.email})`}
      />
      {children}
    </Box>
  )
}
