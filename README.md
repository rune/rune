# Rune Games SDK

[![npm](https://img.shields.io/npm/v/rune-games-sdk)](https://www.npmjs.com/package/rune-games-sdk) [![GitHub Workflow Status (staging)](https://img.shields.io/github/workflow/status/rune/rune-games-sdk/CI/staging)](https://github.com/rune/rune-games-sdk/actions/workflows/CI.yml?query=branch%3Astaging)

Tiny SDK for making your HTML5 game run inside [Rune](https://play.google.com/store/apps/details?id=ai.rune.tincan).

## Install

Include the following line in your `index.html` file before loading any other JS scripts:

```html
<script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@2.2/dist/browser.min.js"></script>
```

## Quick Start
Adapting your HTML5 game to run on Rune is really simple.

```js

// Your game setup code...

// Initialize the Rune SDK once your game is fully ready.
// Rune will invoke these functions based on user actions in the app interface.
Rune.init({
  resumeGame: myResumeGameFunction,
  pauseGame: myPauseGameFunction,
  restartGame: myRestartGameFunction,
  getScore: myGetScoreFunction
})

// When the user loses the game, inform the SDK
Rune.gameOver()
```

That's all it takes to integrate your game with Rune!

## API Details


### Rune.init
The init function should be called after your game is fully ready. At this point, the game can show animations to entice the player, but should not start the actual gameplay as the game may be preloaded.

```js
Rune.init({
  resumeGame: myResumeGameFunction,
  pauseGame: myPauseGameFunction,
  restartGame: myRestartGameFunction,
  getScore: myGetScoreFunction,
})
```

The Rune SDK uses the functions you provide to `Rune.init()` to communicate with your game.

- #### resumeGame
  `resumeGame` will be called in two scenarios:
  - When the player first decides to start your game by hitting play.
  - If the user had paused the game at some point and subsequently presses play again.
  
  Whenever it's called, start / resume the gameplay.

- #### pauseGame
  `pauseGame` will be called whenever the user presses the pause button during gameplay. It should instantly freeze all gameplay and wait until `resumeGame` is called.

- #### restartGame
  `restartGame` is called in two scenarios:
  - In the middle of a game, if a user chooses to press the restart button.
  - After a user has lost a game, when they choose to replay it again.

  Your game should reset all gameplay back to the experience as a completely new player, including resetting the score.

- #### getScore
  The Rune SDK may request your game's score at anytime by calling the `getScore` function. This function should return your game's score as a number.

  For the Rune leaderboard logic to work correctly, your game's score should:
  - be an integer
  - be between 0 and 1 billion (i.e. no negative or extremely high values)
  - treat higher scores as better

### Rune.gameOver
```js
Rune.gameOver()
```
- When the user loses the game / dies / completes the game, call `Rune.gameOver()`.
- Rune will automatically check if it's a new high score, display a confetti animation and encourage the user to share your game / restart and play again.
- The game can freeze or be gently animating until `restartGame` is called by the SDK.

### Rune.getChallengeNumber (optional)

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

## Example Game
Take a look at our [example game](https://github.com/rune/rune-games-sdk/blob/staging/examples/bunny-twirl/index.js) for inspiration or dive into the [source code](https://github.com/rune/rune-games-sdk/blob/staging/src/index.ts).

## Submission

When your game is ready, please zip it as a folder containing `index.html` as the entry point of the game. The folder should contain all resources that are used by the game (css, js, images, soundtracks, helper libs, etc). In other words, please make sure that the game does not fetch any external resources from the Internet except for Rune Games SDK.

## Debugging

Use the [Rune CLI](https://github.com/rune/rune-games-cli) to test your game's integration with the SDK.

## Audio

Your game can have music and sound effects. Rune will automatically mute your game while it is being loaded etc.

## Help

If you're having trouble, please feel free to file an issue in our [GitHub issue tracker](https://github.com/rune/rune-games-sdk/issues).
