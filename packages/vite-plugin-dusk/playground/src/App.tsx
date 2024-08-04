import { useEffect, useState } from "react"
import { GameState } from "./logic.ts"

import logo from "./shared/logo.svg"

export const image = new Image()
image.src = logo

function App() {
  const [game, setGame] = useState<GameState>()
  useEffect(() => {
    Dusk.initClient({
      onChange: ({ game }) => {
        setGame(game)
      },
    })
  }, [])

  if (!game) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div></div>
      <h1>Vite + Dusk</h1>
      <div className="card">
        <button onClick={() => Dusk.actions.increment({ amount: 1 })}>
          count is {game.count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> or <code>src/logic.ts</code> and save to
          test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and Dusk logos to learn more
      </p>
    </>
  )
}

export default App
