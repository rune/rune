import React from "react"
import { GamePage } from "../../components/GamePage"
import BrowserOnly from "@docusaurus/BrowserOnly"

export default function Pinpoint() {
  return (
    <BrowserOnly>
      {() => <GamePage title="Pinpoint" slug="pinpoint" />}
    </BrowserOnly>
  )
}
