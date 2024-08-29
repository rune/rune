import React from "react"
import styles from "./styles.module.scss"
import { Developers } from "./Developers"
import { Game } from "."

type Props = {
  game: Game | null
}
export function OtherGame({ game }: Props) {
  if (!game) return <li className={styles.otherGame}></li>

  const { title, weeklyPlayTimePct, previewImgUrl, developers } = game
  return (
    <li className={styles.otherGame}>
      <h3 className={styles.title}>{title}</h3>
      <img className={styles.previewImg} src={previewImgUrl} alt={title} />
      <p className={styles.stat} title={(weeklyPlayTimePct * 100).toFixed(2)}>
        {Math.round(weeklyPlayTimePct * 100)}%
      </p>
      <Developers developers={developers} inlined={true} />
    </li>
  )
}
