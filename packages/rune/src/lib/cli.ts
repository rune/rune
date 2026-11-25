import meow from "meow"

export const cli = meow(
  `
  Usage
    $ rune create <[optional] project name, defaults to current directory>
    $ rune upload <[optional] game path, defaults to current directory>
    $ rune pull <[optional] game key, defaults to rune.json's> [Downloads the game's current checkpoint and links this folder to it]
    $ rune update-info    [Updating game info (title, description, logo)]
    $ rune list           [Lists all your games]
    $ rune dusk-to-rune <[optional] path> [Migrates your game from Dusk to Rune]
    $ rune dash [Opens the Rune dashboard]
    $ rune extract-translations <[optional] directory to write translation json files to, defaults to public/translations> [Creates or updates translation files based on your use of the Rune.t() function]

  Options
    --version, -v   Show CLI version 

  Optional Upload Options
    --release, -r   Mark the game version as ready for release
    --draft,   -d   Mark the game version as draft
    --name,    -n   <game name>  Name of the existing game.
    --new           <game name>  Create a new Rune game from this folder and upload it as its first checkpoint.

  Examples
    $ rune create my-game

    $ cd my-game && rune upload

    $ rune upload ./my-game

    $ rune upload ./my-game --release --name "My Awesome Game"
    
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
      new: {
        type: "string",
      },
    },
  }
)

export const validCommands = [
  "help",
  "logout",
  "list",
  "upload",
  "pull",
  "update-info",
  "create",
  "dashboard",
  "dash",
  "dusk-to-rune",
  "extract-translations",
] as const

export function cliCommand() {
  const command = cli.input[0] as (typeof validCommands)[number] | undefined

  return {
    command,
    args: cli.input.slice(1),
    commandInvalid: command && !validCommands.includes(command),
    flags: cli.flags,
  }
}

export type CLI = typeof cli
export type CliFlags = CLI["flags"]
