---
sidebar_position: 9
---

# Game Over

When your game ends, you should call [`Rune.gameOver(options)`](api-reference.md#runegameoveroptions) to inform Rune that the game ended. As a result, Rune will overlay a standardized game over popup to the user.

This popup contents will vary depending on the options you pass. The main choice is whether the game has winners/losers or assigns each player a score.

### Delaying Game Over Popup

If you pass [`delayPopUp: true`](api-reference.md#delaypopup-boolean--undefined) to `Rune.gameOver()`, Rune will not show the game popup immediately. This is useful if you want to e.g. display some animation or just make sure that the players see the final game state before the game over popup is shown. In this case, you should call [`Rune.showGameOverPopUp()`](api-reference.md#runeshowgameoverpopup) in your `client.js`. If you don't do it, Rune will still show it automatically after a few seconds.

### Winners and Losers

We support all kinds of combinations of winners and losers and the game over popup will change accordingly. You can have a single winner/loser, many winners/losers or have everyone win or lose. The UI will also look different depending on whether the current player is among the winners, losers or is a spectator.

| Single winner, you won                            | Many winners, you lost                            | Many winners, spectator                             |
| ------------------------------------------------- | ------------------------------------------------- | --------------------------------------------------- |
| ![](/img/gameOverExamples/singleWinnerYouWon.png) | ![](/img/gameOverExamples/manyWinnersYouLost.png) | ![](/img/gameOverExamples/manyWinnersSpectator.png) |

### Player Scores

If your game assigns each player with a score, Rune will show a leaderboard in the game over popup, highlighting the current player. The player with with the highest score wins.

| Ranked, you're 1st                            | Ranked, you're 2nd                             | Ranked, single player                       |
| --------------------------------------------- | ---------------------------------------------- | ------------------------------------------- |
| ![](/img/gameOverExamples/rankedYouFirst.png) | ![](/img/gameOverExamples/rankedYouSecond.png) | ![](/img/gameOverExamples/rankedSingle.png) |
