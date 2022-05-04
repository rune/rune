# Rune Games CLI

Test your HTML5 game inside a mock Rune app to ensure your game works with the [Rune SDK](https://github.com/rune/rune-games-sdk).

## Install

```sh
yarn global add rune-games-cli
# or
npm install -g rune-games-cli
```

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
