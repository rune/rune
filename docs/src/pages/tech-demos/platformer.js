import React from "react"
import { GamePage } from "../../components/GamePage"
import BrowserOnly from "@docusaurus/BrowserOnly"

export default function Platformer() {
  return (
    <BrowserOnly>
      {() => (
        <GamePage
          title="Platformer"
          slug="platformer"
          techDemo={true}
        />
      )}
    </BrowserOnly>
  )
}
