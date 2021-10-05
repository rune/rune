# Rune Games SDK

Tiny SDK for making your HTML5 game run inside [Rune](https://play.google.com/store/apps/details?id=ai.rune.tincan).

## Install

```sh
$ npm install --save rune-games-sdk
```

Or include the following line in your HTML file:

```html
<script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@1.0/dist/browser.min.js"></script>
```

## Usage

Initialize the Rune SDK when initializing your game. The game can show animations to entice the player, but should wait on a tap from the player to start the actual gameplay as the game may be preloaded.

```js
Rune.init({
  startGame: myStartGameFunction,
  pauseGame: myPauseGameFunction,
  resumeGame: myResumeGameFunction,
})
```

Once the player loses the game, your game should call `Rune.gameOver({ score: myGameScore })`. This tells Rune to show the "game over" screen. Your game should not show any "game over" screen and your game does not need to keep track of the user's highscore.

When the player is ready to play again, Rune will call the `startGame` function passed during initialization. Your game should then reset all gameplay back to the experience as a completely new player, including resetting the score.

The player may pause the game through the Rune interface. When this happens, the `pauseGame` function is called to let your game know to freeze all gameplay. Similarly, the `resumeGame` function should unfreeze all gameplay, leaving the player in the same state as before they paused the game.

Take a look at our [example game](https://github.com/rune/rune-games-sdk/blob/staging/examples/bunny-twirl/index.js) for inspiration or dive into the [source code](https://github.com/rune/rune-games-sdk/blob/staging/src/index.ts).

## Score

For the Rune leaderboard logic to work correctly, your game's score should:

- be an integer
- be 0 or higher (i.e. no negative values)
- treat higher scores as better

This is the case by default for most games.

## Help

If you're having trouble, please feel free to file an issue in our [GitHub issue tracker](https://github.com/rune/rune-games-sdk/issues).
