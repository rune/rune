import meow from "meow"

export const cli = meow(
  `
  Usage
    $ rune create <[optional] project name, defaults to current directory>
    $ rune upload <[optional] game path, defaults to current directory>
    $ rune update-info  [Updating game info (title, description, logo)]
    $ rune list         [Lists all your games]

  Options
    --version, -v   Show CLI version 

  Upload Options
    --release, -r   <true|false> Sets the game to either release or playtest
    --confirm, -c   <true|false> Confirm overriding the current game version
    --name,    -n   <game name>  Name of the existing game.

  Examples
    $ rune create my-game

    $ cd my-game && rune upload

    $ rune upload my-game

    $ rune upload my-game --release false --name "My Awesome Game"
    
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
      release: {
        type: "boolean",
        alias: "r",
      },
      name: {
        type: "string",
        alias: "n",
      },
      confirm: {
        type: "boolean",
        alias: "c",
      },
    },
  }
)

export const validCommands = [
  "help",
  "logout",
  "list",
  "upload",
  "update-info",
  "create",
] as const

export function cliCommand() {
  const command = cli.input[0] as typeof validCommands[number] | undefined

  return {
    command,
    args: cli.input.slice(1),
    commandInvalid: command && !validCommands.includes(command),
    flags: cli.flags,
  }
}

export type CLI = typeof cli
export type CliFlags = CLI["flags"]
