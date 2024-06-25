---
sidebar_position: 20
---

# Game Over

When your game ends, you should call [`Dusk.gameOver(options)`](../api-reference.md#duskgameoveroptions) to inform Dusk that the game ended. As a result, Dusk will overlay a standardized game over popup to the user.

This popup contents will vary depending on the options you pass. The main choice is whether the game has winners/losers or assigns each player a score.


### Coop Games {#coop-games}

If your game has a common goal for all players, you can use [`everyone`](../api-reference.md#everyone-game-over) to provide a common result for all players.

```js
// logic.js
Dusk.initLogic({
  actions: {
    myAction: (payload, { game }) => {
      Dusk.gameOver({ everyone: 300 })
    },
  },
})
```

<img src="/img/gameOverExamples/everyone.png" alt="everyone" height="100" style={{height: '600px'}}/>


### Winners, Losers And Ties {#winners-losers-ties}

We support all kinds of combinations of winners, losers and ties and the game over popup will change accordingly. You can have a single winner/loser, many winners/losers/ties or have everyone win/lose/tie. The UI will also look different depending on whether the current player is among the winners, losers, ties or is a spectator.

```js
// logic.js
Dusk.initLogic({
  actions: {
    myAction: (payload, { game }) => {
      if (isGameOver(game)) {
        const winner = getWinner(game)
        const loser = getLoser(game)

        Dusk.gameOver({
          players: {
            [winner.playerId]: "WON",
            [loser.playerId]: "LOST",
          },
        })
      }
    },
  },
})
```

| Winner                             | Loser                               | Tie                                | Spectator                                |
|------------------------------------|-------------------------------------|------------------------------------|------------------------------------------|
| ![](/img/gameOverExamples/win.png) | ![](/img/gameOverExamples/lose.png) | ![](/img/gameOverExamples/tie.png) | ![](/img/gameOverExamples/spectator.png) |

### Player Scores {#player-scores}

If your game assigns each player with a score, Dusk will show a leaderboard in the game over popup, highlighting the current player. The player with with the highest score wins.


```js
// logic.js
Dusk.initLogic({
  actions: {
    myAction: (payload, { game, allPlayerIds }) => {
      if (isGameOver(game)) {
        Dusk.gameOver({
          players: {
            [allPlayerIds[0]]: 21981,
            [allPlayerIds[1]]: 8911,
            [allPlayerIds[2]]: 20109,
            [allPlayerIds[3]]: 323,
          },
        })
      }
    },
  },
})
```


<img src="/img/gameOverExamples/ranked.png" alt="ranked" height="100" style={{height: '600px'}}/>

### Minimizing Game Over Popup {#minimizing-game-over-popup}

If you want to build a custom game over screen, you can pass [`minimizePopUp: true`](../api-reference.md#minimizepopup-boolean) to `Dusk.gameOver()`. This will force the popup to initially be minimized.

<img src="/img/gameOverExamples/minimized.png" alt="minimized" height="100" style={{height: '600px'}}/>

### Delaying Game Over Popup {#delaying-game-over-popup}

If you pass [`delayPopUp: true`](../api-reference.md#delaypopup-boolean) to `Dusk.gameOver()`, Dusk will not show the game popup immediately. This is useful if you want to e.g. display some animation or just make sure that the players see the final game state before the game over popup is shown. In this case, you should call [`Dusk.showGameOverPopUp()`](../api-reference.md#duskshowgameoverpopup) in your `client.js`. If you don't do it, Dusk will still show it automatically after a few seconds.
