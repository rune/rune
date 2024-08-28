import React from "react"
import styles from "./styles.module.scss"
import clsx from "clsx"

type Props = {
  developers: {
    name: string
    avatarUrl: string
  }[]
  inlined: boolean
}
export function Developers({ developers, inlined }: Props) {
  return (
    <div className={clsx(styles.developers, inlined && styles.inlined)}>
      <ul className={styles.avatars}>
        {developers.map(({ name, avatarUrl }, idx) => (
          <li key={idx}>
            <img src={avatarUrl} alt={name} />
          </li>
        ))}
      </ul>
      <ul className={styles.names}>
        {developers.map(({ name }, idx) => (
          <li key={idx}>{name}</li>
        ))}
      </ul>
    </div>
  )
}
