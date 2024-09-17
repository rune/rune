import React from "react"
import styles from "./styles.module.scss"
import clsx from "clsx"
import { Developers } from "./Developers"
import { Game } from "."

type Props = {
  game: Game | null
  place: 1 | 2 | 3
}
export function TopGame({ game, place }: Props) {
  if (!game)
    return <li className={clsx(styles.topGame, styles[`place-${place}`])}></li>

  const { title, weeklyPlayTimePct, shareLink, previewImgUrl, developers } =
    game

  return (
    <li className={clsx(styles.topGame, styles[`place-${place}`])}>
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
      <Developers developers={developers} inlined={false} />
    </li>
  )
}
