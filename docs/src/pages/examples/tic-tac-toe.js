import React from "react"
import { GamePage } from "../../components/GamePage"
import BrowserOnly from "@docusaurus/BrowserOnly"

export default function TicTacToe() {
  return (
    <BrowserOnly>
      {() => <GamePage title="Tic Tac Toe" slug="tic-tac-toe" />}
    </BrowserOnly>
  )
}
