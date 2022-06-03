# Rune Games SDK

[![npm](https://img.shields.io/npm/v/rune-games-sdk)](https://www.npmjs.com/package/rune-games-sdk) [![GitHub Workflow Status (staging)](https://img.shields.io/github/workflow/status/rune/rune-games-sdk/CI/staging)](https://github.com/rune/rune-games-sdk/actions/workflows/CI.yml?query=branch%3Astaging)

Tiny SDK for making your HTML5 game run inside [Rune](https://play.google.com/store/apps/details?id=ai.rune.tincan).

## Install

Include the following line in your `index.html` file before loading any other JS scripts:

```html
<script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@2.0/dist/browser.min.js"></script>
```

## Use

Initialize the Rune SDK once your game is fully ready.

```js
Rune.init({
  resumeGame: myResumeGameFunction,
  pauseGame: myPauseGameFunction,
  restartGame: myRestartGameFunction,
  getScore: myGetScoreFunction,
})
```

At this point, the game can show animations to entice the player, but should not start the actual gameplay as the game may be preloaded. When the player wants to start your game, Rune will call the provided `resumeGame` function to let your game know to start the gameplay.

Once the player loses the game, your game should call `Rune.gameOver()`. This tells Rune to show the "game over" screen. Your game should not show any "game over" screen and your game does not need to keep track of the user's highscore.

When the player is ready to play again, Rune will call the `restartGame` function. Your game should then reset all gameplay back to the experience as a completely new player, including resetting the score. The player is also able to restart the game manually, which will make Rune call the `restartGame` function.

The player may pause the game through the Rune interface. When this happens, the `pauseGame` function is called to let your game know to freeze all gameplay. Similarly, the `resumeGame` function should unfreeze all gameplay, leaving the player in the same state as before they paused the game.

The Rune SDK may request your game's score at anytime by calling the `getScore` function. This function should return your game's score as a number.

Take a look at our [example game](https://github.com/rune/rune-games-sdk/blob/staging/examples/bunny-twirl/index.js) for inspiration or dive into the [source code](https://github.com/rune/rune-games-sdk/blob/staging/src/index.ts).

## Challenge Number (optional)

Rune provides a challenge number through `Rune.getChallengeNumber()` that will increment every day starting from value 1. It's optional to use the challenge number, but we strongly encourage using it to keep your game entertaining and make everyone compete under the same conditions.

Here's two common ways you could use the challenge number:

<details>
<summary>1) Iterate through a fixed list of game content (e.g. maps)</summary>

---

Often games have a fixed list of maps, powerups, artwork or other kinds of content. You can use the challenge number to iterate through these so that players experience a new one every day. For instance, you can use the modulo operator to iterate through a fixed list of maps:

```js
const mapIds = [1, 2, 3, 4, 5, 6, 7] // Define your fixed list of maps

const challengeNumber = Rune.getChallengeNumber() // Get today's challenge number

const mapId = mapIds[challengeNumber % mapIds.length] // Get deterministic mapId
```

---

</details>

<details>
<summary>2) For deterministic randomness (e.g. map generation)</summary>

---

Rune provides a random number generator using the challenge number as seed. This random number generator will therefore always provide the same random values for the same challenge number.

You can use `Rune.deterministicRandom()` instead of `Math.random()` in your map generation code to ensure all players play the same map. The `Rune.deterministicRandom()` function returns a value between 0 and 1 similar to `Math.random()`.

You should only use `Rune.deterministicRandom()` for your map generation and not as a generic replacement for `Math.random()`. This is because each call to `Rune.deterministicRandom()` will iterate through the random values. Any unintentional calls to `Rune.deterministicRandom()` would therefore break the deterministic randomness.

---

</details>

For instance, for a racing game with 20 predefined maps you would use method (1) above. Alternatively, if the racing game randomly generates maps by placing turns and obstacles then you would use method (2). The high-level goal is just to make sure that your game is deterministic, i.e. the same challenge number always creates the same player experience.

## Submission

When your game is ready, please zip it as a folder containing `index.html` as the entry point of the game. The folder should contain all resources that are used by the game (css, js, images, soundtracks, helper libs, etc). In other words, please make sure that the game does not fetch any external resources from the Internet except for Rune Games SDK.

## Debugging

Use the [Rune CLI](https://github.com/rune/rune-games-cli) to test your game's integration with the SDK.

## Score

For the Rune leaderboard logic to work correctly, your game's score should:

- be an integer
- be between 0 and 1 billion (i.e. no negative or extremely high values)
- treat higher scores as better

This is the case by default for most games.

## Audio

Your game can have music and sound effects. Rune will automatically mute your game while it is being loaded etc.

## Help

If you're having trouble, please feel free to file an issue in our [GitHub issue tracker](https://github.com/rune/rune-games-sdk/issues).
