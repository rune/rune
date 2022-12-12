---
sidebar_position: 1
---

# Singleplayer SDK

Rune methods for writing singleplayer games.

## `Rune.init(options)`

The `init` function should be called after your game is fully ready. At this point, the game can show animations to entice the player, but should not start the actual gameplay as the game may be preloaded.

```js
Rune.init({
  resumeGame: myResumeGameFunction,
  pauseGame: myPauseGameFunction,
  restartGame: myRestartGameFunction,
  getScore: myGetScoreFunction,
})
```

The Rune SDK uses the functions you provide to `Rune.init()` to communicate with your game.

### `resumeGame`

Rune will call this function when:

1. The player first decides to start your game by hitting play.
2. The player had paused the game and subsequently presses play again.

Your game should start / resume the gameplay.

### `pauseGame`

Rune will call this function when:

1. The player presses the pause button while playing.

Your game should instantly freeze all gameplay and wait until `resumeGame` is called.

### `restartGame`

Rune will call this function when:

1. The player presses the restart button in the middle of a game.
2. The player has lost a game and chooses to play it again.

Your game should reset all gameplay back to the experience as a completely new player, including resetting the score.

### `getScore`

Rune may request your game's score at anytime by calling this function, which should return your game's score. For the Rune leaderboard logic to work correctly, your game's score should:

- be an integer
- be between 0 and 1 billion
- treat higher scores as better

## `Rune.gameOver()`

When the player loses or completes the game, call `Rune.gameOver()`.

```js
Rune.gameOver()
```

- Rune will check if it's a new high score and encourage the player to share your game or play again.
- Your game should freeze until `restartGame` is called.
- Your game doesn't need to show a "game over" screen. Rune overlays a standardized high score interface to the user.

## `Rune.getChallengeNumber()`

Returns a challenge number that is incremented daily.

```js
const challengeNumber = Rune.getChallengeNumber()
```

Often games have a fixed list of maps, powerups, artwork or other kinds of content. You can use the challenge number to iterate through these so that players experience a new one every day. For instance, you can use the modulo operator to iterate through a fixed list of maps:

```js
const mapIds = [1, 2, 3, 4, 5, 6, 7] // Define your fixed list of maps

const challengeNumber = Rune.getChallengeNumber() // Get today's challenge number

const mapId = mapIds[challengeNumber % mapIds.length] // Get deterministic mapId
```

## `Rune.deterministicRandom()`

Returns a value between 0 and 1 in a deterministic way.

```js
const obstacleSpeed = Rune.deterministicRandom()
```

Rune provides a deterministic random number generator that uses the challenge number as seed. This random number generator will always provide the same random values for the same challenge number.

You can use `Rune.deterministicRandom()` instead of `Math.random()` in your map generation code to ensure all players play the same map. The `Rune.deterministicRandom()` function returns a value between 0 and 1 similar to `Math.random()`.

You should only use `Rune.deterministicRandom()` for your map generation and not as a generic replacement for `Math.random()`. This is because each call to `Rune.deterministicRandom()` will iterate through the random values. Any unintentional calls to `Rune.deterministicRandom()` would therefore break the deterministic randomness.
