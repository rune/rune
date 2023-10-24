import React from "react"
import { GamePage } from "../../components/GamePage"
import BrowserOnly from "@docusaurus/BrowserOnly"

export default function CubeRush() {
  return (
    <BrowserOnly>
      {() => <GamePage title="Cube Rush" slug="cube-rush" />}
    </BrowserOnly>
  )
}
