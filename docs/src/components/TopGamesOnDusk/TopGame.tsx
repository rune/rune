import React from "react"
import styles from "./styles.module.scss"
import clsx from "clsx"

type Props = {
  title: string
  weeklyPlayTimePct: number
  previewImgUrl: string
  authors: string[]
  place: 1 | 2 | 3
}
export function TopGame({
  title,
  weeklyPlayTimePct,
  previewImgUrl,
  place,
}: Props) {
  return (
    <li className={clsx(styles.topGame, `place-${place}`)}>
      <h3 className={styles.title}>{title}</h3>
      <img
        className={styles.previewImg}
        src={previewImgUrl}
        alt={`Preview of ${title}`}
      />
      <p className={styles.stat}>
        {Math.round(weeklyPlayTimePct * 100)}% playtime
      </p>
      <div className={styles.authors}>TODO: Avatars</div>
    </li>
  )
}
