import React from "react"
import styles from "./styles.module.scss"

type Props = {
  title: string
  weeklyPlayTimePct: number
  previewImgUrl: string
  authors: string[]
}
export function OtherGame({
  title,
  weeklyPlayTimePct,
  previewImgUrl,
  authors,
}: Props) {
  return (
    <li className={styles.otherGame}>
      <h3 className={styles.title}>{title}</h3>
      <img className={styles.previewImg} src={previewImgUrl} alt={title} />
      <p className={styles.stat}>{Math.round(weeklyPlayTimePct * 100 * 2)}%</p>
      <div className={styles.authors}>
        {authors.map((author) => `@${author}`).join(", ")}
      </div>
    </li>
  )
}
