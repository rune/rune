import React, { useEffect, useState } from "react"
import { TopGame } from "./TopGame"
import styles from "./styles.module.scss"
import { OtherGame } from "./OtherGame"

export function TopGamesOnDusk() {
  const [games, setGames] = useState<Game[] | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGames()
      .then(setGames)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return null
  }

  if (!games) {
    return <p>Failed to fetch games. Try again!</p>
  }

  return (
    <div className={styles.container}>
      <ol className={styles.topGames}>
        <TopGame {...games[0]} place={1} />
        <TopGame {...games[1]} place={2} />
        <TopGame {...games[2]} place={3} />
      </ol>
      <p className={styles.info}>
        Based on the percentage of the last week's playtime.
      </p>
      <ol className={styles.otherGames} start={3}>
        {games.slice(3).map((game, idx) => {
          return <OtherGame key={game.title} {...game} />
        })}
      </ol>
    </div>
  )
}

type Game = {
  title: string
  previewImgUrl: string
  authors: string[]
  weeklyPlayTimePct: number
}

async function getGames() {
  const res = await fetch(
    "https://tango-production.rune.ai/v1/public/games-top-10"
  )
  const json = await res.json()

  if (!json.success) {
    throw new Error("Failed to fetch top games")
  }

  return json.games as Game[]
}
