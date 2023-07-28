import meow from "meow"

export const cli = meow(
  `
  Usage
    $ rune create <[optional] project name, defaults to current directory>
    $ rune upload <[optional] game path, defaults to current directory>
    $ rune list

  Options
    --version, -v   Show CLI version

  Examples
    $ rune create my-game

    $ cd my-game && rune upload

    $ rune upload my-game
    
`,
  {
    importMeta: import.meta,
    autoHelp: false,
    autoVersion: false,
    flags: {
      version: {
        type: "boolean",
        alias: "v",
      },
    },
  }
)

export const validCommands = [
  "help",
  "logout",
  "list",
  "upload",
  "update",
  "create",
] as const

export function cliCommand() {
  const command = cli.input[0] as typeof validCommands[number] | undefined

  return {
    command,
    args: cli.input.slice(1),
    commandInvalid: command && !validCommands.includes(command),
  }
}
