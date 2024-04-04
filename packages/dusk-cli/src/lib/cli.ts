import meow from "meow"

export const cli = meow(
  `
  Usage
    $ dusk create <[optional] project name, defaults to current directory>
    $ dusk upload <[optional] game path, defaults to current directory>
    $ dusk update-info    [Updating game info (title, description, logo)]
    $ dusk list           [Lists all your games]
    $ dusk update-members [Sets up team for your game]

  Options
    --version, -v   Show CLI version 

  Optional Upload Options
    --release, -r   Mark the game version as ready for release
    --draft,   -d   Mark the game version as draft
    --name,    -n   <game name>  Name of the existing game.

  Examples
    $ dusk create my-game

    $ cd my-game && dusk upload

    $ dusk upload ./my-game

    $ dusk upload ./my-game --release --name "My Awesome Game"
    
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
        alias: "r",
        type: "boolean",
        default: false,
      },
      draft: {
        alias: "d",
        type: "boolean",
        default: false,
      },

      name: {
        type: "string",
        alias: "n",
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
  "update-members",
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
