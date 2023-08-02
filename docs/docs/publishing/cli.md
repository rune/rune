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

### `rune create`

Creates a new example game using Vite template.

```bash
rune create
# or
rune create my-game
```

Follow instructions on the terminal to run the game in mock Rune app. The interface is identical to the one described in [Simulating Multiplayer](simulating-multiplayer.md).

### `rune upload`

Uploads your game to Rune for publishing, see [Publishing Your Game](publishing-your-game.md) for more info.

```bash
cd my-game && rune upload
# or
rune upload my-game
```

This command will log you in using your email (if it's the first time) and then guide you through the game upload process.

### `rune list`

Displays a list of your games on Rune.

### `rune update-info`

Update your game's info such as title, description or logo.

### `rune logout`

Log out from the CLI.

### `rune help`

Displays help text.
