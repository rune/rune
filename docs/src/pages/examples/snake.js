import React from "react"
import { GamePage } from "../../components/GamePage"
import BrowserOnly from "@docusaurus/BrowserOnly"

export default function Snake() {
  return (
    <BrowserOnly>
      {() => <GamePage title="Neon Snake" slug="snake" />}
    </BrowserOnly>
  )
}
