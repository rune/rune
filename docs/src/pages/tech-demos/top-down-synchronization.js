import React from "react"
import { GamePage } from "../../components/GamePage"
import BrowserOnly from "@docusaurus/BrowserOnly"

export default function TopDownSynchronization() {
  return (
    <BrowserOnly>
      {() => (
        <GamePage
          title="Top Down Synchronization"
          slug="top-down-synchronization"
          techDemo={true}
        />
      )}
    </BrowserOnly>
  )
}
