---
sidebar_position: 1
---

# Intro

:::caution

We're focusing most of our energy on the [Multiplayer SDK](multiplayer/intro.md) so don't expect any updates on the singleplayer side.

:::

## Install

Include the following line in your `index.html` file before loading any other JS scripts:

```html
<script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@4/singleplayer.js"></script>
```

## Quick Start

Adapting your HTML5 game to run on Rune is really simple.

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

## Next steps

- [Explore the API reference](api-reference.md)
