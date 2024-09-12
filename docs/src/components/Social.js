import React from "react"
import styles from "./Social.module.scss"

export function Social() {
  return (
    <>
      <a
        href="https://github.com/rune/rune"
        target="_blank"
        rel="noreferrer"
        className={styles.socialLink}
      >
        <img
          alt="GitHub Logo"
          src={
            require("!!url-loader!@site/static/img/home/social/github.svg")
              .default
          }
        />
        <img
          alt="GitHub Logo"
          src={
            require("!!url-loader!@site/static/img/home/social/github-hover.svg")
              .default
          }
        />
      </a>
      <a
        href="https://discord.gg/dusk-devs"
        target="_blank"
        rel="noreferrer"
        className={styles.socialLink}
      >
        <img
          alt="Discord Logo"
          src={
            require("!!url-loader!@site/static/img/home/social/discord.svg")
              .default
          }
        />
        <img
          alt="Discord Logo"
          src={
            require("!!url-loader!@site/static/img/home/social/discord-hover.svg")
              .default
          }
        />
      </a>
      <a
        href="https://twitter.com/dusk_devs"
        target="_blank"
        rel="noreferrer"
        className={styles.socialLink}
      >
        <img
          alt="Twitter Logo"
          src={
            require("!!url-loader!@site/static/img/home/social/twitter.svg")
              .default
          }
        />
        <img
          alt="Twitter Logo"
          src={
            require("!!url-loader!@site/static/img/home/social/twitter-hover.svg")
              .default
          }
        />
      </a>
    </>
  )
}
