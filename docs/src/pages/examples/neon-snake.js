import React from "react"
import { GamePage } from "../../components/GamePage"
import BrowserOnly from "@docusaurus/BrowserOnly"

export default function NeonSnake() {
  return (
    <BrowserOnly>
      {() => <GamePage title="Neon Snake" slug="neon-snake" />}
    </BrowserOnly>
  )
}
