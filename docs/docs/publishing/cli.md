---
sidebar_position: 100
---

# CLI Reference

For a smooth development experience use the `dusk` CLI in your terminal.

## Install {#install}

```bash
npm install -g dusk-cli
```

Requires [Node.js](https://nodejs.org/en/download/) version 14.17 or above.

## Commands {#commands}

### `dusk create` {#dusk-create}

Creates a new example game using Vite template.

```bash
dusk create
# or
dusk create my-game
```

Follow the instructions on the terminal to run the game in mock Dusk app. The interface is identical to the one described in [Simulating Multiplayer](../playtesting/simulating-multiplayer.md).

### `dusk upload` {#dusk-upload}

Uploads your game to Dusk for publishing, see [Publishing Your Game](publishing-your-game.md) for more info.

```bash
cd my-game && dusk upload
# or
dusk upload my-game
```

This command will log you in using your email (if it's the first time) and then guide you through the game upload process. If you want to upload a new version of your game, just run the command again.

### `dusk list` {#dusk-list}

Displays a list of your games on Dusk.

### `dusk update-info` {#dusk-update-info}

Update your game's info such as title, description or game preview.

### `dusk update-members` {#dusk-update-members}

Update the team for your game (e.g. adding a new team member), see [Collaboration](collaboration.md) for more info.

### `dusk logout` {#dusk-logout}

Log out from the CLI.

### `dusk help` {#dusk-help}

Displays help text.
