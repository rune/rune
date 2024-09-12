import React from "react"
import styles from "./styles.module.scss"
import { Developers } from "./Developers"
import { Game } from "."

type Props = {
  game: Game | null
}
export function OtherGame({ game }: Props) {
  if (!game) return <li className={styles.otherGame}></li>

  const { title, weeklyPlayTimePct, shareLink, previewImgUrl, developers } =
    game
  return (
    <li className={styles.otherGame}>
      <h3 className={styles.title}>
        <a href={shareLink} target="_blank">
          {title}
        </a>
      </h3>
      <a href={shareLink} target="_blank" className={styles.previewImg}>
        <img src={previewImgUrl} alt={title} />
      </a>
      <p className={styles.stat} title={(weeklyPlayTimePct * 100).toFixed(2)}>
        {Math.round(weeklyPlayTimePct * 100)}%
      </p>
      <Developers developers={developers} inlined={true} />
    </li>
  )
}
