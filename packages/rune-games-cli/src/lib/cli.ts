import meow from "meow"

export const cli = meow(
  `
  Usage
    $ rune start <[optional] game path or URL, defaults to current directory>
    $ rune upload <[optional] game path, defaults to current directory>
    $ rune list

  Options
    --version, -v   Show CLI version

  Examples
    $ cd game/path && rune start

    $ rune start game/path

    $ rune start https://game-url.com

    $ cd game/path && rune upload

    $ rune upload game/path
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
  "start",
  "logout",
  "list",
  "upload",
  "update",
] as const

export function cliCommand() {
  const command = cli.input[0] as typeof validCommands[number] | undefined

  return {
    command,
    args: cli.input.slice(1),
    commandInvalid: command && !validCommands.includes(command),
  }
}
