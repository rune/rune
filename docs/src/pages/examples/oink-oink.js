import React from "react"
import { GamePage } from "../../components/GamePage"
import BrowserOnly from "@docusaurus/BrowserOnly"

export default function OinkOink() {
  return (
    <BrowserOnly>
      {() => <GamePage title="OinkOink" slug="oink-oink" />}
    </BrowserOnly>
  )
}
