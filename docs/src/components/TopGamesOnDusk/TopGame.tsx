import React, { useEffect, useState } from "react"
import styles from "./styles.module.scss"

type Props = {
  title: string
  weeklyPlayTimePct: number
  previewImgUrl: string
  authors: string[]
  scale: number
}
export function TopGame({
  title,
  weeklyPlayTimePct,
  previewImgUrl,
  scale,
}: Props) {
  return (
    <li className={styles.topGame} style={{ height: scale * 400 }}>
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
