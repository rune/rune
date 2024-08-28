import React from "react"
import styles from "./styles.module.scss"

type Props = {
  title: string
  weeklyPlayTimePct: number
  previewImgUrl: string
  developers: { name: string }[]
}
export function OtherGame({
  title,
  weeklyPlayTimePct,
  previewImgUrl,
  developers,
}: Props) {
  return (
    <li className={styles.otherGame}>
      <h3 className={styles.title}>{title}</h3>
      <img className={styles.previewImg} src={previewImgUrl} alt={title} />
      <p className={styles.stat}>{Math.round(weeklyPlayTimePct * 100 * 2)}%</p>
      <div className={styles.developers}>
        {developers.map((d) => `@${d.name}`).join(", ")}
      </div>
    </li>
  )
}
