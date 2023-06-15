import React from "react"
import { GamePage } from "../../components/GamePage"
import BrowserOnly from "@docusaurus/BrowserOnly"

export default function Sudoku() {
  return (
    <BrowserOnly>{() => <GamePage title="Sudoku" slug="sudoku" />}</BrowserOnly>
  )
}
