# Rune Games SDK

Tiny SDK for making your HTML5 game run inside [Rune](https://play.google.com/store/apps/details?id=ai.rune.tincan).

## Install

Include the following line at the top of your `index.html` file:

```html
<script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@1.4/dist/browser.min.js"></script>
```

## Usage

Initialize the Rune SDK once your game is fully ready.

```js
Rune.init({
  startGame: myStartGameFunction,
  pauseGame: myPauseGameFunction,
  resumeGame: myResumeGameFunction,
  getScore: myGetScoreFunction,
})
```

At this point, the game can show animations to entice the player, but should not start the actual gameplay as the game may be preloaded. When the player wants to start your game, Rune will call the provided `startGame` function to let your game know to start the gameplay.

Once the player loses the game, your game should call `Rune.gameOver()`. This tells Rune to show the "game over" screen. Your game should not show any "game over" screen and your game does not need to keep track of the user's highscore.

When the player is ready to play again, Rune will call the `startGame` function. Your game should then reset all gameplay back to the experience as a completely new player, including resetting the score.

The player may pause the game through the Rune interface. When this happens, the `pauseGame` function is called to let your game know to freeze all gameplay. Similarly, the `resumeGame` function should unfreeze all gameplay, leaving the player in the same state as before they paused the game.

The Rune SDK may request your game's score at anytime by calling the `getScore` function. This function should return your game's score as a number.

Take a look at our [example game](https://github.com/rune/rune-games-sdk/blob/staging/examples/bunny-twirl/index.js) for inspiration or dive into the [source code](https://github.com/rune/rune-games-sdk/blob/staging/src/index.ts).

### Challenge Number (optional)

Rune provides a challenge number through `Rune.getChallengeNumber()` that will increment every day starting from value 1. It's optional to use the challenge number, but we strongly encourage you to use it for your game as it has multiple benefits:
- Changes your game content every day so to ensure your game is always fresh and entertaining
- Makes everyone compete under the same conditions to ensure fairness and increase competition

You could e.g. use the challenge number in the following ways:

<details>
<summary>1) As a seed for randomness</summary>
&nbsp;
  
If your game uses randomness to determine the gameplay (i.e. by randomly generating the maps), you can use the challenge number as the seed to achieve deterministic randomness. For example:

```js
import seedrandom from 'seedrandom' // From https://www.npmjs.com/package/seedrandom

const challengeNumber = Rune.getChallengeNumber() // Get today's challenge number
const random = seedrandom(challengeNumber) // Make deterministic number generator

const pseudoRandomNumber = random() // Get pseudorandom number in range of [0, 1)
const numberOfEnemies =  Math.floor(pseudoRandomNumber * 200) + 1 // Get number of enemies in range of [1, 200]
```
</details>

<details>
<summary>2) Iterate through a fixed list of game content (e.g. maps)</summary>
&nbsp;
  
Often games have a fixed list of maps, powerups, artwork or other kinds of content. You can use the challenge number to iterate through these so that players experience a new one every day. For instance, you can use the modulo operator to iterate through a fixed list of maps:

```js
const mapIds = [1, 2, 3, 4, 5, 6, 7] // Define your fixed list of maps

const challengeNumber = Rune.getChallengeNumber() // Get today's challenge number

const mapId = mapIds[challengeNumber % mapIds.length] // Get deterministic mapId
```
</details>

Please make sure that your game is deterministic, i.e. providing it with the same challenge number provide the same player experience.

## Submission

When you are done with your game, please zip the folder that contains the implementation.

Also, make sure that:

- The folder contains `index.html` and it is the entry point of the game.
- The folder contains all resources that are used by the game: css, js, images, soundtracks, helper libs etc. In other words, please make sure that when loading or playing the game no external resources are fetched from the Internet except for Rune Games SDK.

## Debugging Locally

To make it easy for you to debug your game locally, this SDK will:

- Call the `startGame` function 3 seconds after your game called `Rune.init()`
- Call the `startGame` function 3 seconds after your game called `Rune.gameOver()`

This simulates what the SDK will do based on player actions when your game is running inside [Rune](https://play.google.com/store/apps/details?id=ai.rune.tincan).

## Score

For the Rune leaderboard logic to work correctly, your game's score should:

- be an integer
- be between 0 and 1 billion (i.e. no negative or extremely high values)
- treat higher scores as better

This is the case by default for most games.

## Audio

Your game can have soundtracks and sound effects. However, your game should not play any audio before the `startGame` function is called.

## Help

If you're having trouble, please feel free to file an issue in our [GitHub issue tracker](https://github.com/rune/rune-games-sdk/issues).
