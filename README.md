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
// Rune will invoke these functions based on player actions in the app interface.
Rune.init({
  resumeGame: myResumeGameFunction,
  pauseGame: myPauseGameFunction,
  restartGame: myRestartGameFunction,
  getScore: myGetScoreFunction
})

// When the player loses the game, inform the SDK
Rune.gameOver()
```

That's all it takes to integrate your game with Rune!

## Core API

- [`Rune.init`](https://github.com/rune/rune-games-sdk#runeinit)
- [`Rune.gameOver`](https://github.com/rune/rune-games-sdk#runegameover)

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
  Rune will call this function when:
  1. The player first decides to start your game by hitting play.
  2. The player had paused the game and subsequently presses play again.
  
  Your game should start / resume the gameplay.

- #### pauseGame
  Rune will call this function when:
  1. The player presses the pause button while playing.
  
  Your game should instantly freeze all gameplay and wait until `resumeGame` is called.

- #### restartGame
  Rune will call this function when:
  1. The player presses the restart button in the middle of a game.
  2. The player has lost a game and chooses to play it again.

  Your game should reset all gameplay back to the experience as a completely new player, including resetting the score.

- #### getScore
  Rune may request your game's score at anytime by calling this function, which should return your game's score. For the Rune leaderboard logic to work correctly, your game's score should:
  - be an integer
  - be between 0 and 1 billion
  - treat higher scores as better

### Rune.gameOver
When the player loses or completes the game, call `Rune.gameOver()`.

```js
Rune.gameOver()
```

- Rune will check if it's a new high score and encourage the player to share your game or play again.
- Your game should freeze until `restartGame` is called. 
- Your game need not show a "game over" screen. Rune overlays a standardized high score interface to the user.

## Daily Challenges API (optional)
Rune has built in support for "daily" challenges. Daily challenges ensure two things:
1. The game changes in some way every day — colors / maps / levels / new physics — it's completely up to your creativity.
2. All users play the same map / version of the game everyday.

It's optional to support daily challenges.
- If your game supports challenges, Rune will automatically create daily leaderboards for it. Players really enjoy having a fresh leaderboard to climb every day.
- We strongly encourage using it to keep your game entertaining. Dedicated players have something novel in your game everyday. They won't burn through all your levels / maps too quickly.

There are two ways to support challenges:

- [`Rune.getChallengeNumber`](https://github.com/rune/rune-games-sdk#runegetchallengenumber-optional)
    - Suitable for iterating through a fixed set of levels / maps.
    - For example, a puzzle game with 20 different puzzles.
- [`Rune.deterministicRandom`](https://github.com/rune/rune-games-sdk#runedeterministicrandom-optional)
    - Suitable for maps that are generated using randomizers
    - For example, a racing game where the turns in the race track and obstacles are generated using randomization.

The high-level goal is to make sure that your game is deterministic, i.e. the same challenge number always creates the same player experience. This is especially important since players won't find it fair to compete on the daily leaderboard if they're playing a completely different map from someone else on the same leaderboard.

### Rune.getChallengeNumber
Rune simply supplies a challenge number that is incremented daily.
```js
const challengeNumber = Rune.getChallengeNumber()
```

Often games have a fixed list of maps, powerups, artwork or other kinds of content. You can use the challenge number to iterate through these so that players experience a new one every day. For instance, you can use the modulo operator to iterate through a fixed list of maps:

```js
const mapIds = [1, 2, 3, 4, 5, 6, 7] // Define your fixed list of maps

const challengeNumber = Rune.getChallengeNumber() // Get today's challenge number

const mapId = mapIds[challengeNumber % mapIds.length] // Get deterministic mapId
```


### Rune.deterministicRandom
Rune provides a random number generator that uses the challenge number as seed. This random number generator will therefore always provide the same random values for the same challenge number.

```js
const obstacleSpeed = Rune.deterministicRandom()
```

You can use `Rune.deterministicRandom()` instead of `Math.random()` in your map generation code to ensure all players play the same map. The `Rune.deterministicRandom()` function returns a value between 0 and 1 similar to `Math.random()`.

You should only use `Rune.deterministicRandom()` for your map generation and not as a generic replacement for `Math.random()`. This is because each call to `Rune.deterministicRandom()` will iterate through the random values. Any unintentional calls to `Rune.deterministicRandom()` would therefore break the deterministic randomness.

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
