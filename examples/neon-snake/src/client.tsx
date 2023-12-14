import React from "react"
import ReactDOM from "react-dom/client"
import { App } from "./App.tsx"
import { Provider } from "jotai"
import { $state, store } from "./state/state.ts"
import { playSound } from "./sounds.ts"

Rune.initClient({
  onChange: ({ previousGame, game, players, yourPlayerId }) => {
    if (yourPlayerId) {
      const previousPlayer = previousGame.players.find(
        (p) => p.playerId === yourPlayerId,
      )
      const currentPlayer = game.players.find(
        (p) => p.playerId === yourPlayerId,
      )

      //Player collided
      if (
        previousPlayer?.state === "alive" &&
        currentPlayer?.state === "dead"
      ) {
        playSound("lost")
      }

      //Last player alive
      if ((previousPlayer?.score ?? 0) < (currentPlayer?.score ?? 0)) {
        playSound("won")
      }
    }

    store.set($state, {
      ready: true,
      game,
      players,
      yourPlayerId,
    })
  },
})

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
