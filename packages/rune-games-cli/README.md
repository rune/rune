# Rune Games CLI

[![npm](https://img.shields.io/npm/v/rune-games-cli)](https://www.npmjs.com/package/rune-games-cli) [![GitHub Workflow Status (master)](https://img.shields.io/github/workflow/status/rune/rune-games-cli/CI/master)](https://github.com/rune/rune-games-cli/actions/workflows/CI.yml?query=branch%3Amaster)

Test your HTML5 game inside a mock Rune app to ensure your game works with the [Rune SDK](https://github.com/rune/rune-games-sdk).

## Install

```sh
yarn global add rune-games-cli
# or
npm install -g rune-games-cli
```

Here's download links for the [yarn](https://classic.yarnpkg.com/lang/en/docs/install) and [npm](https://docs.npmjs.com/cli/v8/commands/npm-install) package managers in case you don't already have one installed.

## Use

```sh
cd game/path && rune start
# or
rune start game/path
# or
rune start https://game-url.com
```

You should see something like

```sh
╭────────────────────────────────────────────────────────────────────────────╮
│                                                                            │
│    App is available at http://localhost:3000, http://192.168.0.101:3000    │
│    Game: /my-games/my-game-1                                               │
│                                                                            │
│    Press `q` to exit                                    Rune CLI v1.0.0    │
│                                                                            │
╰────────────────────────────────────────────────────────────────────────────╯
```

When you open this URL you should see your game running inside a mock Rune app.
Press the ⚙️ icon to open the developer tools. There you can e.g. change the game
challenge number.

<img src="https://user-images.githubusercontent.com/7106681/166223264-81029004-c985-49e6-b486-1d134686354e.png" height="500" /> <img src="https://user-images.githubusercontent.com/7106681/166223386-1d04ba1d-bde7-40c8-a94b-b4d12b13249b.png" height="500" />
