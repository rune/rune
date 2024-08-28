import React from "react"
import styles from "./styles.module.scss"
import clsx from "clsx"
import { Developers } from "./Developers"

type Props = {
  title: string
  weeklyPlayTimePct: number
  previewImgUrl: string
  developers: { name: string; avatarUrl: string }[]
  place: 1 | 2 | 3
}
export function TopGame({
  title,
  weeklyPlayTimePct,
  previewImgUrl,
  developers,
  place,
}: Props) {
  return (
    <li className={clsx(styles.topGame, `place-${place}`)}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.previewImg}>
        <img src={previewImgUrl} alt={title} />
      </div>
      <p className={styles.stat}>
        {Math.round(weeklyPlayTimePct * 100)}% playtime
      </p>
      <Developers developers={developers} inlined={false} />
    </li>
  )
}
