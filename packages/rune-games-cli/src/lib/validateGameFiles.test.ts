import { describe, test, expect, jest } from "@jest/globals"
import { range } from "lodash"
import * as path from "path"

import { FileInfo } from "./getGameFiles"
import { validateGameFiles, ValidationResult } from "./validateGameFiles"

jest.mock("./rootPath.ts", () => ({
  rootPath: path.resolve(__dirname, "../.."),
}))

const validLogicFile = {
  path: "src/logic.js",
  size: 1 * 1e6,
  // language=JavaScript
  content: `
    Rune.initLogic({
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
const validLogicMultiplayer = {
  handlesPlayerJoined: true,
  handlesPlayerLeft: true,
  minPlayers: 1,
  maxPlayers: 4,
  updatesPerSecondDefined: false,
}

describe("validateGameFiles", () => {
  test("should validate game content", async () => {
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
                  <script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@4.8.1/dist/multiplayer.js"></script>
                  <script src="src/logic.js"></script>
                </head>
                <body></body>
              </html>`,
        },
      ],
      { valid: true, errors: [], multiplayer: validLogicMultiplayer }
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
                  <script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@4.8.1/dist/singleplayer.js"></script>
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
            message:
              "Rune SDK script url must end with /multiplayer.js or /multiplayer-dev.js",
          },
        ],
        multiplayer: undefined,
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
                  <script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@4.4.5/dist/multiplayer.js"></script>
                  <script src="src/logic.js"></script>
                </head>
                <body></body>
              </html>`,
        },
      ],
      {
        valid: false,
        multiplayer: validLogicMultiplayer,
        errors: [
          {
            message:
              "Rune SDK is below minimum version (included 4.4.5, min 4.8.1)",
          },
        ],
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
                  <script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@4.4/dist/multiplayer.js"></script>
                  <script src="src/logic.js"></script>
                </head>
                <body></body>
              </html>`,
        },
      ],
      {
        valid: false,
        multiplayer: validLogicMultiplayer,
        errors: [
          {
            message:
              "Rune SDK is below minimum version (included 4.4, min 4.8.1)",
          },
        ],
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
                  <script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@3/dist/multiplayer.js"></script>
                  <script src="src/logic.js"></script>
                </head>
                <body></body>
              </html>`,
        },
      ],
      {
        valid: false,
        multiplayer: validLogicMultiplayer,
        errors: [
          {
            message:
              "Rune SDK is below minimum version (included 3, min 4.8.1)",
          },
        ],
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
                  <script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@4/dist/multiplayer.js"></script>
                  <script src="src/logic.js"></script>
                </head>
                <body></body>
              </html>`,
        },
      ],
      {
        valid: true,
        multiplayer: validLogicMultiplayer,
        errors: [],
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
                  <script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@4/dist/multiplayer.js"></script>
                  <script src="src/logic.js"></script>
                </head>
                <body></body>
              </html>`,
        },
      ],
      {
        // valid because we should only look at the root index.html
        valid: true,
        multiplayer: validLogicMultiplayer,
        errors: [],
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
                  <script src="https://cdn.jsdelivr.net/npm/rune-games-sdk/dist/multiplayer.js"></script>
                  <script src="src/logic.js"></script>
                </head>
                <body></body>
              </html>`,
        },
      ],
      {
        valid: false,
        multiplayer: validLogicMultiplayer,
        errors: [{ message: "Rune SDK must specify a version" }],
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
                  <script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@4.8.1/dist/multiplayer.js"></script>
                </head>
                <body></body>
              </html>`,
        },
      ],
      {
        valid: false,
        multiplayer: validLogicMultiplayer,
        errors: [
          { message: "Game size must be less than 10MB" },
          { message: "Rune SDK must be the first script in index.html" },
        ],
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
        multiplayer: undefined,
        errors: [{ message: "Game index.html must include Rune SDK script" }],
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
            message: "index.html content has not been provided for validation",
          },
        ],
      }
    )

    await check(
      [{ path: "media/background.png", size: 1 * 1e6 }, validLogicFile],
      {
        valid: false,
        errors: [{ message: "Game must include index.html" }],
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
                <script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@4.8.1/dist/multiplayer.js"></script>
              </html>`,
        },
      ],
      {
        valid: false,
        errors: [
          { message: "logic.js must be included in the game files" },
          { message: "Rune SDK must be the first script in index.html" },
        ],
        multiplayer: {},
      }
    )

    await check(
      [
        {
          path: "index.html",
          size: 1 * 1e6,
          content: `
              <html>
                <script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@4.8.1/dist/multiplayer.js"></script>
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
            message: "logic.js content has not been provided for validation",
          },
        ],
        multiplayer: {},
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
                <script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@4.8.1/dist/multiplayer-dev.js"></script>
                <script src="logic.js"></script>
              </html>`,
        },
        {
          path: "logic.js",
          size: 1 * 1e6,
          // language=JavaScript
          content: `
            Rune.initLogic({
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
        multiplayer: {
          handlesPlayerJoined: true,
          handlesPlayerLeft: true,
          minPlayers: undefined,
          maxPlayers: undefined,
          updatesPerSecondDefined: false,
        },
      }
    )

    await check(
      [
        {
          path: "index.html",
          size: 1 * 1e6,
          content: `
              <html>
                <script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@4.8.1/dist/multiplayer.js"></script>
                <script src="logic.js"></script>
              </html>`,
        },
        {
          path: "logic.js",
          size: 1 * 1e6,
          // language=JavaScript
          content: `
              Rune.initLogic({
                minPlayers: 6,
                maxPlayers: 5,
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
          { message: "logic.js: minPlayers must be between 1 and 4" },
          { message: "logic.js: maxPlayers must be between 1 and 4" },
          {
            message:
              "logic.js: maxPlayers must be greater than or equal to minPlayers",
          },
        ],
        multiplayer: {
          handlesPlayerJoined: true,
          handlesPlayerLeft: true,
          minPlayers: 6,
          maxPlayers: 5,
          updatesPerSecondDefined: false,
        },
      }
    )

    await check(
      [
        {
          path: "index.html",
          size: 1 * 1e6,
          content: `
              <html>
                <script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@4.8.1/dist/multiplayer.js"></script>
                <script src="logic.js"></script>
              </html>`,
        },
        {
          path: "logic.js",
          size: 1 * 1e6,
          // language=JavaScript
          content: `
              Rune.initLogic({
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
        multiplayer: {
          handlesPlayerJoined: true,
          handlesPlayerLeft: true,
          minPlayers: 2,
          maxPlayers: 4,
          updatesPerSecondDefined: false,
        },
      }
    )

    await check(
      [
        {
          path: "index.html",
          size: 1 * 1e6,
          content: `
              <html>
                <script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@4.8.1/dist/multiplayer.js"></script>
                <script src="logic.js"></script>
              </html>`,
        },
        {
          path: "logic.js",
          size: 1 * 1e6,
          // language=JavaScript
          content: `
              Rune.initLogic({
                minPlayers: 2,
                maxPlayers: 4,
                setup: () => {
                  console.log("console is allowed")
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
        valid: true,
        errors: [],
        multiplayer: {
          handlesPlayerJoined: true,
          handlesPlayerLeft: true,
          minPlayers: 2,
          maxPlayers: 4,
          updatesPerSecondDefined: false,
        },
      }
    )

    await check(
      [
        {
          path: "index.html",
          size: 1 * 1e6,
          content: `
              <html>
                <script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@4.8.1/dist/multiplayer.js"></script>
                <script src="src/logic.js"></script>
              </html>`,
        },
        {
          path: "src/logic.js",
          size: 1 * 1e6,
          content: "",
        },
      ],
      {
        valid: false,
        errors: [
          { message: "logic.js must be in the same directory as index.html" },
          {
            message: "logic.js content has not been provided for validation",
          },
        ],
        multiplayer: {},
      }
    )

    await check(
      [
        {
          path: "index.html",
          size: 1 * 1e6,
          content: `
              <html>
                <script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@4.8.1/dist/multiplayer.js"></script>
                <script type="module" src="client.js"></script>
              </html>`,
        },
        {
          path: "logic.js",
          size: 1 * 1e6,
          // language=JavaScript
          content: `
              Rune.initLogic({
                minPlayers: 2,
                maxPlayers: 4,
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
        {
          path: "client.js",
          size: 1 * 1e6,
          content: "import 'logic.js';",
        },
      ],
      {
        valid: true,
        errors: [],
        multiplayer: {
          handlesPlayerJoined: true,
          handlesPlayerLeft: true,
          maxPlayers: 4,
          minPlayers: 2,
          updatesPerSecondDefined: false,
        },
      }
    )

    await check(
      [
        {
          path: "index.html",
          size: 1 * 1e6,
          content: `
              <html>
                <script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@4.8.1/dist/multiplayer.js"></script>
                <script src="logic.js"></script>
              </html>`,
        },
        {
          path: "logic.js",
          size: 1 * 1e6,
          // language=JavaScript
          content: `
              Rune.initLogic({
                minPlayers: 1,
                maxPlayers: 4,
                updatesPerSecond: 40,
                inputDelay: 50,
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
            message:
              "logic.js: updatesPerSecond must be undefined or between 1 and 30",
          },
        ],
        multiplayer: {
          handlesPlayerJoined: true,
          handlesPlayerLeft: true,
          minPlayers: 1,
          maxPlayers: 4,
          updatesPerSecond: 40,
          updatesPerSecondDefined: true,
          inputDelay: 50,
        },
      }
    )

    await check(
      [
        {
          path: "index.html",
          size: 1 * 1e6,
          content: `
              <html>
                <script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@4.8.1/dist/multiplayer.js"></script>
                <script src="logic.js"></script>
              </html>`,
        },
        {
          path: "logic.js",
          size: 1 * 1e6,
          // language=JavaScript
          content: `
            Rune.initLogic({
              minPlayers: 1,
              maxPlayers: 4,
              updatesPerSecond: 10,
              inputDelay: 60,
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
            message:
              "logic.js: inputDelay must be undefined or between 0 and 50",
          },
        ],
        multiplayer: {
          handlesPlayerJoined: true,
          handlesPlayerLeft: true,
          minPlayers: 1,
          maxPlayers: 4,
          inputDelay: 60,
          updatesPerSecond: 10,
          updatesPerSecondDefined: true,
        },
      }
    )

    await check(
      [
        {
          path: "index.html",
          size: 1 * 1e6,
          content: `
              <html>
                <script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@4.8.1/dist/multiplayer.js"></script>
                <script src="logic.js"></script>
              </html>`,
        },
        {
          path: "logic.js",
          size: 1 * 1e6,
          // language=JavaScript
          content: `
              Rune.initLogic({
                minPlayers: 1,
                maxPlayers: 4,
                updatesPerSecond: 10,
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
        valid: true,
        errors: [],
        multiplayer: {
          handlesPlayerJoined: true,
          handlesPlayerLeft: true,
          minPlayers: 1,
          maxPlayers: 4,
          updatesPerSecond: 10,
          updatesPerSecondDefined: true,
        },
      }
    )

    await check(
      [
        {
          path: "index.html",
          size: 1 * 1e6,
          content: `
              <html>
                <script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@4.8.1/dist/multiplayer.js"></script>
                <script src="logic.js"></script>
              </html>`,
        },
        {
          path: "logic.js",
          size: 1 * 1e6,
          // language=JavaScript
          content: `
            const UPDATES_PER_SECOND = 30;
            
            Rune.initLogic({
              minPlayers: 1,
              maxPlayers: 4,
              updatesPerSecond: UPDATES_PER_SECOND,
              inputDelay: 50,
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
            message:
              "logic.js: updatesPerSecond must be a constant (updatesPerSecond: 1-30)",
          },
        ],
        multiplayer: {
          handlesPlayerJoined: true,
          handlesPlayerLeft: true,
          minPlayers: 1,
          maxPlayers: 4,
          updatesPerSecond: undefined,
          updatesPerSecondDefined: true,
          inputDelay: 50,
        },
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
                <script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@4.8.1/dist/multiplayer-dev.js"></script>
                <script src="logic.js"></script>
              </html>`,
        },
        {
          path: "logic.js",
          size: 1 * 1e6 + 1,
          // language=JavaScript
          content: `
            Rune.initLogic({
              minPlayers: 1,
              maxPlayers: 4,
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
          {
            message: "logic.js size can't be more than 1MB",
          },
        ],
        multiplayer: {
          handlesPlayerJoined: true,
          handlesPlayerLeft: true,
          minPlayers: 1,
          maxPlayers: 4,
          updatesPerSecondDefined: false,
        },
      }
    )

    function check(files: FileInfo[], expected: ValidationResult) {
      return expect(validateGameFiles(files)).resolves.toEqual(expected)
    }
  })
})
