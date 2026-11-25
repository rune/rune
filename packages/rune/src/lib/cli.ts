import meow from "meow"

export const cli = meow(
  `
  Usage
    $ rune create <[optional] project name, defaults to current directory>
    $ rune upload <[optional] game path, defaults to current directory> [Uploads the game as a checkpoint in the Rune editor; the first upload links the folder to a game in rune.json]
    $ rune update-info    [Updating game info (title, description, logo)]
    $ rune list           [Lists all your games]
    $ rune dusk-to-rune <[optional] path> [Migrates your game from Dusk to Rune]
    $ rune dash [Opens the Rune dashboard]
    $ rune extract-translations <[optional] directory to write translation json files to, defaults to public/translations> [Creates or updates translation files based on your use of the Rune.t() function]

  Options
    --version, -v   Show CLI version 

  Optional Upload Options
    --release, -r   Submit the upload for review
    --name,    -n   <game name>  First upload: link to your game with this name, or create it
    --description   <text>  First upload: the new game's description

  Examples
    $ rune create my-game

    $ cd my-game && rune upload

    $ rune upload ./my-game

    $ rune upload ./my-game --release

    $ rune upload --name "My Awesome Game" --description "Race your friends"
    
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

      name: {
        type: "string",
        alias: "n",
      },
      description: {
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
