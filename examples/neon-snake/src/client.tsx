import React from "react"
import ReactDOM from "react-dom/client"
import { App } from "./App.tsx"
import { Provider } from "jotai"
import { $state, store } from "./state/state.ts"

Rune.initClient({
  onChange: ({ game, players, yourPlayerId }) => {
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
