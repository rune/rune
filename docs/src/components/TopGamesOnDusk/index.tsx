import React, { useEffect, useState } from "react"
import { TopGame } from "./TopGame"
import styles from "./styles.module.scss"
import { OtherGame } from "./OtherGame"

export function TopGamesOnDusk() {
  const [gameRes, setGameRes] = useState<GameRes | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGames()
      .then(setGameRes)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return null
  }

  if (!gameRes) {
    return <p>Failed to fetch games. Try again!</p>
  }

  return (
    <div className={styles.container}>
      <ol className={styles.topGames}>
        <TopGame {...gameRes.games[0]} place={1} />
        <TopGame {...gameRes.games[1]} place={2} />
        <TopGame {...gameRes.games[2]} place={3} />
      </ol>
      <p className={styles.info}>
        Based on the percentage of the last week's playtime.
      </p>
      <ol className={styles.otherGames} start={3}>
        {gameRes.games.slice(3).map((game, idx) => {
          return <OtherGame key={game.title} {...game} />
        })}
      </ol>
    </div>
  )
}

type Game = {
  title: string
  previewImgUrl: string
  developers: { name: string }[]
  weeklyPlayTimePct: number
}

type GameRes = {
  dateStart: Date
  games: Game[]
}

async function getGames() {
  const res = await fetch(
    "https://tango-production.rune.ai/v1/public/games-top-10"
  )
  const json = await res.json()

  if (!json.success) {
    throw new Error("Failed to fetch top games")
  }

  return {
    ...json,
    dateStart: new Date(json.dateStart),
  } as GameRes
}
