---
sidebar_position: 100
---

# CLI Reference

For a smooth development experience use the `rune` CLI in your terminal.

## Install

```bash
npm install -g rune-games-cli
```

Requires [Node.js](https://nodejs.org/en/download/) version 14.17 or above.

## Commands

### `rune start`

Starts a development server that emulates your game running in the Rune app. This interface is identical to the one described in [Simulating Multiplayer](simulating-multiplayer.md).

```bash
cd game/path && rune start
# or
rune start game/path
# or
rune start https://game-url.com
```

### `rune upload`

Uploads your game to Rune for publishing, see [Publishing Your Game](publishing-your-game.md) for more info.

```bash
cd game/path && rune upload
# or
rune upload game/path
```

This command will log you in using your email (if it's the first time) and then guide you through the game upload process.

### `rune list`

Displays a list of your games on Rune.

### `rune logout`

Log out from the CLI.

### `rune help`

Displays help text.
