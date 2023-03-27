---
sidebar_position: 6
---

# Command Line Interface

For a smooth development experience use the `rune` CLI in your terminal.

## Requirements

- [Node.js](https://nodejs.org/en/download/) version 14.17 or above.

## Installation

```bash
npm install -g rune-games-cli
```

## Commands

### `rune start`

Starts a development server that emulates your game running in the Rune app.

```bash
cd game/path && rune start
# or
rune start game/path
# or
rune start https://game-url.com
```

You should see something like

```bash
╭──────────────────────────────────────────────────────────────────────────╮
│                                                                          │
│    Test locally: http://localhost:3000                                   │
│    Test on your phone: http://192.168.50.252:3000 (same network only)    │
│    Game: /my-games/my-game-1                                             │
│                                                                          │
│    Press `q` to exit                                         Rune CLI    │
│                                                                          │
╰──────────────────────────────────────────────────────────────────────────╯
```

When you open this URL you should see your multiplayer game running inside a mock Rune app.
To simulate the multiplayer experience, the Rune CLI runs many instances of your game side-by-side.  
Press the ⚙️ icon to open the developer tools, which allows you to emulate network latency, game restarts, etc.

<img width="500" src="https://user-images.githubusercontent.com/378279/207116826-1a0cb459-444b-4e84-a3b0-21631797cbc3.png"/>

### `rune upload`

Uploads your game to Rune for publishing, see [Publishing Your Game](publishing.md) for more info.

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
