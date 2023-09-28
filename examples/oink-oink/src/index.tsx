import "./style/setGlobalStyle"
import ReactDOM from "react-dom/client"
import { App } from "./components/App/App"
import { $state } from "./state/$state"
import { Provider, createStore } from "jotai"

const store = createStore()

import("./logic").then(() => {
  Rune.initClient({
    onChange: ({ game, players, yourPlayerId, event }) => {
      store.set($state, {
        ready: true,
        game: game,
        players,
        yourPlayerId,
      })
    },
  })
})

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
  <Provider store={store}>
    <App />
  </Provider>
)
