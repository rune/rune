import React from "react"
import { GamePage } from "../../components/GamePage"
import BrowserOnly from "@docusaurus/BrowserOnly"

export default function Paddle() {
  return (
    <BrowserOnly>{() => <GamePage title="Paddle" slug="paddle" />}</BrowserOnly>
  )
}
