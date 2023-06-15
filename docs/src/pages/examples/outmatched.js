import React from "react"
import { GamePage } from "../../components/GamePage"
import BrowserOnly from "@docusaurus/BrowserOnly"

export default function Outmatched() {
  return (
    <BrowserOnly>
      <GamePage title="Outmatched" slug="outmatched" />
    </BrowserOnly>
  )
}
