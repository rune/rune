import { Text } from "ink"
import React from "react"

import { List } from "../flows/List.js"
import { Logout } from "../flows/Logout.js"
import { Start } from "../flows/Start/Start.js"
import { Update } from "../flows/Update/Update.js"
import { Upload } from "../flows/Upload/Upload.js"
import { cliCommand, cli } from "../lib/cli.js"
import { packageJson } from "../lib/packageJson.js"

import { LoginGate } from "./LoginGate.js"
import { VersionCheckGate } from "./VersionCheckGate.js"

export function App() {
  const { command, args, commandInvalid } = cliCommand()

  if (commandInvalid) {
    return <Text color="red">Invalid command `{command}`</Text>
  }

  return (
    <VersionCheckGate>
      {cli.flags.version ? (
        <Text>{packageJson.version}</Text>
      ) : !command || command === "help" ? (
        <Text>{cli.help}</Text>
      ) : command === "start" ? (
        <Start />
      ) : command === "logout" ? (
        <Logout />
      ) : (
        <LoginGate>
          {command === "list" ? (
            <List />
          ) : command === "upload" ? (
            <Upload />
          ) : command === "update" ? (
            <Update args={args} />
          ) : null}
        </LoginGate>
      )}
    </VersionCheckGate>
  )
}
