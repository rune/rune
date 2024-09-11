import React from "react"
import { GamePage } from "../../components/GamePage"
import BrowserOnly from "@docusaurus/BrowserOnly"

export default function Phaser() {
  return (
    <BrowserOnly>
      {() => <GamePage title="Phaser" slug="phaser" techDemo={true} />}
    </BrowserOnly>
  )
}
