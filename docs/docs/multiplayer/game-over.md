---
sidebar_position: 9
---

# Game Over

When your game ends, you should call
[`Rune.gameOver(options)`](../api/multiplayer.md#runegameoveroptions) to
inform Rune that the game ended. As a result, Rune will overlay a standardized
game over popup to the user.

This popup contents will vary depending on the options you pass. The main
difference is whether the game defines its result in terms of winners and losers
or does it want to give each player a score.

### Delaying Game Over Popup

If you pass
[`delayPopUp: true`](../api/multiplayer.md#delaypopup-boolean--undefined)
to `Rune.gameOver()`, Rune will not show the game
popup immediately. This is useful if you want to e.g. display some animation or
just make sure that the players can see the final game state before the game
over popup is shown. In this case, you should call
[`Rune.showGameOverPopUp()`](../api/multiplayer.md#runeshowgameoverpopup) in
your **client** code. If you don't do it, Rune will still show it automatically
after some default delay.

### Winners and Losers

We support all kinds of combinations of winners and losers and the game over
popup will change accordingly. You can have a single winner/loser, many
winners/losers or have everyone win or lose. The UI will also look different
depending on whether the current player is among the winners, losers or is a
spectator.

|                                                                                                           |                                                                                                           |                                                                                                           |
| --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| ![](https://user-images.githubusercontent.com/7106681/224114798-de66f739-d7a0-45b5-be6c-e597fdcfa6b0.PNG) | ![](https://user-images.githubusercontent.com/7106681/224114770-e0c78fce-b4dd-49d6-83e0-972cf86e706b.PNG) | ![](https://user-images.githubusercontent.com/7106681/224114768-dc1b5933-28b7-42d3-980f-49b6b510f045.PNG) |

### Player scores

If your game wants to give each player a score, the Rune will show a leaderboard
in the game over popup, highlighting the current player. In case there were many
players, the one with the highest score is the winner.

|                                                                                                           |                                                                                                           |                                                                                                           |
| --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| ![](https://user-images.githubusercontent.com/7106681/224114746-2708afe3-3545-44e7-9a2c-5c28e8dbbfd1.PNG) | ![](https://user-images.githubusercontent.com/7106681/224114741-4f046eaf-e6e2-4fc0-b832-feada6b821a1.PNG) | ![](https://user-images.githubusercontent.com/7106681/224114732-a1bd0502-4673-459d-b865-ba60ae9c6cac.PNG) |
