import { describe, test, expect, jest } from "@jest/globals"
import { range } from "lodash"
import * as path from "path"

import { FileInfo } from "./getGameFiles"
import {
  MAX_PLAYERS,
  validateGameFilesInCLI,
  ValidationResult,
} from "./validateGameFiles"

jest.mock("./rootPath.ts", () => ({
  rootPath: path.resolve(__dirname, "../.."),
}))

describe("validateGameFiles", () => {
  test("should validate game content", async () => {
    await Promise.all(
      [
        ["Rune", "rune-games-sdk"],
        ["Dusk", "dusk-games-sdk"],
      ].map(async ([n, packageName]) => {
        const name = n as "Rune" | "Dusk"

        const validLogicFile = {
          path: "src/logic.js",
          size: 1 * 1e6,
          // language=JavaScript
          content: `
            ${name}.initLogic({
              minPlayers: 1,
              maxPlayers: 4,
              setup: () => {
                return {}
              },
              actions: {},
              events: {
                playerJoined: () => {},
                playerLeft () {},
              },
            })`,
        }

        await check(
          [
            { path: "media/background.png", size: 1 * 1e6 },
            validLogicFile,
            {
              path: "src/index.html",
              size: 1 * 1e6,
              content: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <title>Game</title>
                  <script src="https://cdn.jsdelivr.net/npm/${packageName}@4.8.1/dist/multiplayer.js"></script>
                  <script src="src/logic.js"></script>
                </head>
                <body></body>
              </html>`,
            },
          ],
          {
            valid: true,
            errors: [],
            sdk: name,
          }
        )

        await check(
          [
            { path: "media/background.png", size: 1 * 1e6 },
            validLogicFile,
            {
              path: "src/index.html",
              size: 1 * 1e6,
              content: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <title>Game</title>
                  <script src="https://cdn.jsdelivr.net/npm/${packageName}@4.8.1/dist/singleplayer.js"></script>
                  <script src="src/logic.js"></script>
                </head>
                <body></body>
              </html>`,
            },
          ],
          {
            valid: false,
            errors: [
              {
                message: `${name} SDK script url must end with /multiplayer.js or /multiplayer-dev.js`,
              },
            ],
            sdk: name,
          }
        )

        await check(
          [
            { path: "media/background.png", size: 1 * 1e6 },
            validLogicFile,
            {
              path: "src/index.html",
              size: 1 * 1e6,
              content: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <title>Game</title>
                  <script src="https://cdn.jsdelivr.net/npm/${packageName}@4.4.5/dist/multiplayer.js"></script>
                  <script src="src/logic.js"></script>
                </head>
                <body></body>
              </html>`,
            },
          ],
          {
            valid: false,
            errors: [
              {
                message: `${name} SDK is below minimum version (included 4.4.5, min 4.8.1)`,
              },
            ],
            sdk: name,
          }
        )

        await check(
          [
            { path: "media/background.png", size: 1 * 1e6 },
            validLogicFile,
            {
              path: "src/index.html",
              size: 1 * 1e6,
              content: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <title>Game</title>
                  <script src="https://cdn.jsdelivr.net/npm/${packageName}@4.4/dist/multiplayer.js"></script>
                  <script src="src/logic.js"></script>
                </head>
                <body></body>
              </html>`,
            },
          ],
          {
            valid: false,
            errors: [
              {
                message: `${name} SDK is below minimum version (included 4.4, min 4.8.1)`,
              },
            ],
            sdk: name,
          }
        )

        await check(
          [
            { path: "media/background.png", size: 1 * 1e6 },
            validLogicFile,
            {
              path: "src/index.html",
              size: 1 * 1e6,
              content: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <title>Game</title>
                  <script src="https://cdn.jsdelivr.net/npm/${packageName}@3/dist/multiplayer.js"></script>
                  <script src="src/logic.js"></script>
                </head>
                <body></body>
              </html>`,
            },
          ],
          {
            valid: false,
            errors: [
              {
                message: `${name} SDK is below minimum version (included 3, min 4.8.1)`,
              },
            ],
            sdk: name,
          }
        )

        await check(
          [
            { path: "media/background.png", size: 1 * 1e6 },
            validLogicFile,
            {
              path: "src/index.html",
              size: 1 * 1e6,
              content: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <title>Game</title>
                  <script src="https://cdn.jsdelivr.net/npm/${packageName}@4/dist/multiplayer.js"></script>
                  <script src="src/logic.js"></script>
                </head>
                <body></body>
              </html>`,
            },
          ],
          {
            valid: true,
            errors: [],
            sdk: name,
          }
        )

        await check(
          [
            { path: "media/background.png", size: 1 * 1e6 },
            validLogicFile,
            {
              path: "src/nestedFolder/index.html",
              size: 1 * 1e6,
              content: `
              <!DOCTYPE html>
              <html lang="en">
                INVALID CONTENT
              </html>`,
            },
            {
              path: "src/index.html",
              size: 1 * 1e6,
              content: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <title>Game</title>
                  <script src="https://cdn.jsdelivr.net/npm/${packageName}@4/dist/multiplayer.js"></script>
                  <script src="src/logic.js"></script>
                </head>
                <body></body>
              </html>`,
            },
          ],
          {
            // valid because we should only look at the root index.html
            valid: true,
            errors: [],
            sdk: name,
          }
        )

        await check(
          [
            { path: "media/background.png", size: 1 * 1e6 },
            validLogicFile,
            {
              path: "src/index.html",
              size: 1 * 1e6,
              content: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <title>Game</title>
                  <script src="https://cdn.jsdelivr.net/npm/${packageName}/dist/multiplayer.js"></script>
                  <script src="src/logic.js"></script>
                </head>
                <body></body>
              </html>`,
            },
          ],
          {
            valid: false,
            errors: [{ message: `${name} SDK must specify a version` }],
            sdk: name,
          }
        )

        await check(
          [
            { path: "media/background.png", size: 30 * 1e6 },
            validLogicFile,
            {
              path: "src/index.html",
              size: 10 * 1e6,
              content: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <title>Game</title>
                  <script src="src/logic.js"></script>
                  <script src="https://cdn.jsdelivr.net/npm/${packageName}@4.8.1/dist/multiplayer.js"></script>
                </head>
                <body></body>
              </html>`,
            },
          ],
          {
            valid: false,
            errors: [
              { message: "Game size must be less than 10MB" },
              { message: `${name} SDK must be the first script in index.html` },
            ],
            sdk: name,
          }
        )

        await check(
          [
            { path: "media/background.png", size: 1 * 1e6 },
            validLogicFile,
            {
              path: "src/index.html",
              size: 1 * 1e6,
              content: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <title>Game</title>
                  <script src="src/logic.js"></script>
                </head>
                <body></body>
              </html>`,
            },
          ],
          {
            valid: false,
            errors: [
              { message: `Game index.html must include Rune SDK script` },
            ],
            sdk: "Rune",
          }
        )

        await check(
          [
            { path: "media/background.png", size: 1 * 1e6 },
            validLogicFile,
            { path: "src/index.html", size: 1 * 1e6 },
          ],
          {
            valid: false,
            errors: [
              {
                message:
                  "index.html content has not been provided for validation",
              },
            ],
            sdk: "Rune",
          }
        )

        await check(
          [{ path: "media/background.png", size: 1 * 1e6 }, validLogicFile],
          {
            valid: false,
            errors: [{ message: "Game must include index.html" }],
            sdk: "Rune",
          }
        )

        await check(
          range(0, 1001).map(() => ({ path: "path/to/file.png", size: 1 })),
          {
            valid: false,
            errors: [
              { message: "Too many files (>1000)" },
              { message: "Game must include index.html" },
            ],
            sdk: "Rune",
          }
        )

        await check(
          [
            {
              path: "src/index.html",
              size: 1 * 1e6,
              content: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <title>Game</title>
                </head>
                <body>
                  <script src="src/logic.js">
                  <div>
                </body>
              </html>`,
            },
          ],
          {
            valid: false,
            errors: [{ message: "index.html is not valid HTML" }],
            sdk: "Rune",
          }
        )

        await check(
          [
            {
              path: "index.html",
              size: 1 * 1e6,
              content: `
              <html>
                <script src="logic.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/${packageName}@4.8.1/dist/multiplayer.js"></script>
              </html>`,
            },
          ],
          {
            valid: false,
            errors: [
              { message: "logic.js must be included in the game files" },
              { message: `${name} SDK must be the first script in index.html` },
            ],
            sdk: name,
          }
        )

        await check(
          [
            {
              path: "index.html",
              size: 1 * 1e6,
              content: `
              <html>
                <script src="https://cdn.jsdelivr.net/npm/${packageName}@4.8.1/dist/multiplayer.js"></script>
                <script src="logic.js"></script>
              </html>`,
            },
            {
              path: "logic.js",
              size: 1 * 1e6,
            },
          ],
          {
            valid: false,
            errors: [
              {
                message:
                  "logic.js content has not been provided for validation",
              },
            ],
            sdk: name,
          }
        )

        await check(
          [
            {
              path: "index.html",
              size: 1 * 1e6,
              content: `
              <html>
                <!-- multiplayer-dev.js is also detected as multiplayer -->
                <script src="https://cdn.jsdelivr.net/npm/${packageName}@4.8.1/dist/multiplayer-dev.js"></script>
                <script src="logic.js"></script>
              </html>`,
            },
            {
              path: "logic.js",
              size: 1 * 1e6,
              // language=JavaScript
              content: `
            ${name}.initLogic({
              minPlayers: "33",
              setup: () => {
                return { cells: Array(25).fill(null) }
              },
              actions: {},
              events: {
                playerJoined: () => {},
                playerLeft () {} ,
              },
            })`,
            },
          ],
          {
            valid: false,
            errors: [
              { message: "logic.js: minPlayers not found or is invalid" },
              { message: "logic.js: maxPlayers not found or is invalid" },
            ],
            sdk: name,
          }
        )

        await check(
          [
            {
              path: "index.html",
              size: 1 * 1e6,
              content: `
              <html>
                <script src="https://cdn.jsdelivr.net/npm/${packageName}@4.8.1/dist/multiplayer.js"></script>
                <script src="logic.js"></script>
              </html>`,
            },
            {
              path: "logic.js",
              size: 1 * 1e6,
              // language=JavaScript
              content: `
              ${name}.initLogic({
                minPlayers: 8,
                maxPlayers: 7,
                setup: () => {
                  return { cells: Array(25).fill(null) }
                },
                actions: {},
                events: {
                  playerJoined: () => {},
                  playerLeft () {},
                },
              })`,
            },
          ],
          {
            valid: false,
            errors: [
              {
                message: `logic.js: minPlayers must be between 1 and ${MAX_PLAYERS}`,
              },
              {
                message: `logic.js: maxPlayers must be between 1 and ${MAX_PLAYERS}`,
              },
              {
                message:
                  "logic.js: maxPlayers must be greater than or equal to minPlayers",
              },
            ],
            sdk: name,
          }
        )

        await check(
          [
            {
              path: "index.html",
              size: 1 * 1e6,
              content: `
              <html>
                <script src="https://cdn.jsdelivr.net/npm/${packageName}@4.8.1/dist/multiplayer.js"></script>
                <script src="logic.js"></script>
              </html>`,
            },
            {
              path: "logic.js",
              size: 1 * 1e6,
              // language=JavaScript
              content: `
              ${name}.initLogic({
                minPlayers: 2,
                maxPlayers: 4,
                setup: () => {
                  setTimeout(() => {}, 1000)
                  return { cells: Array(25).fill(null) }
                },
                actions: {},
                events: {
                  playerJoined: () => {},
                  playerLeft () {},
                },
              })`,
            },
          ],
          {
            valid: false,
            errors: [
              {
                message: "logic.js contains invalid code",
                lintErrors: [
                  {
                    column: 19,
                    endColumn: 29,
                    endLine: 6,
                    line: 6,
                    message: "'setTimeout' is not defined.",
                    messageId: "undef",
                    nodeType: "Identifier",
                    ruleId: "no-undef",
                    severity: 2,
                  },
                ],
              },
            ],
            sdk: name,
          }
        )
      })
    )

    function check(files: FileInfo[], expected: ValidationResult) {
      return expect(validateGameFilesInCLI(files)).resolves.toEqual(expected)
    }
  })
})
