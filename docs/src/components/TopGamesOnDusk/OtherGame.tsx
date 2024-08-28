import React, { useEffect, useState } from "react"
import styles from "./styles.module.scss"

type Props = {
  title: string
  weeklyPlayTimePct: number
  previewImgUrl: string
  authors: string[]
}
export function OtherGame({ title, weeklyPlayTimePct, previewImgUrl }: Props) {
  return (
    <li className={styles.otherGame}>
      <h3 className={styles.title}>{title}</h3>
      <img
        className={styles.previewImg}
        src={previewImgUrl}
        alt={`Preview of ${title}`}
      />
      <p className={styles.stat}>{Math.round(weeklyPlayTimePct * 100 * 2)}%</p>
      <div className={styles.authors}>TODO: Avatars</div>
    </li>
  )
}
