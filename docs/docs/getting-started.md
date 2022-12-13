---
sidebar_position: 1
---

# Getting Started

## Install

Include the following line in your `index.html` file before loading any other JS scripts:

```html
<script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@3/singleplayer.js"></script>
```

## Quick Start

Adapting your singleplayer HTML5 game to run on Rune is really simple.

```js
// Your game setup code...

// Initialize the Rune SDK once your game is fully ready.
// Rune will invoke these functions based on player actions in the app interface.
Rune.init({
  resumeGame: myResumeGameFunction,
  pauseGame: myPauseGameFunction,
  restartGame: myRestartGameFunction,
  getScore: myGetScoreFunction,
})

// When the player loses the game, inform the SDK
Rune.gameOver()
```

That's all it takes to integrate your game with Rune! You can take a look at our [example game](https://github.com/rune/rune-games-sdk/blob/staging/singleplayer/examples/breakout/) for inspiration.

:::tip

Rune also supports **multiplayer**, which has a slightly [different setup](multiplayer/setup.md) and [API](api/multiplayer.md).

:::

## Running Your Game

The [Rune CLI](https://github.com/rune/rune-games-cli) runs your game in a mock Rune app and makes debugging easy. To use the CLI, make sure to have [Node.js](https://nodejs.org/en/download/) version 14.17 or above installed first.

```bash
npm install -g rune-games-cli
cd my-game-folder
rune start
```

## Now what?

- [Read about our best practices](best-practices.md)
- Look at examples of [singleplayer](singleplayer/examples.md) and [multiplayer](multiplayer/examples.md) games
- [Set up daily challenges](singleplayer/challenges.md)
- [Set up multiplayer support](multiplayer/setup.md)
- [Publish your game](publishing.md)
