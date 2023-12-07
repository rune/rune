import React from "react"
import styles from "./index.module.scss"
import clsx from "clsx"
import Link from "@docusaurus/Link"

function Footer() {
  const footerCopyright = <>© {new Date().getFullYear()} Rune</>

  const footerLinks = (
    <>
      <Link className={styles.link} to="/docs/examples">
        Examples
      </Link>
      <a
        className={styles.link}
        href="https://rune.ai"
        target="_blank"
        rel="noreferrer"
      >
        Get Rune
      </a>
      <a
        className={styles.link}
        href="https://rune.ai/team"
        target="_blank"
        rel="noreferrer"
      >
        About
      </a>
    </>
  )

  const footerSocial = (
    <>
      <a
        href="https://github.com/rune/rune-games-sdk"
        target="_blank"
        rel="noreferrer"
      >
        <img
          alt="GitHub Logo"
          src={
            require("!!url-loader!@site/static/img/home/social/github.svg")
              .default
          }
        />
      </a>
      <a href="https://discord.gg/rune-devs" target="_blank" rel="noreferrer">
        <img
          alt="Discord Logo"
          src={
            require("!!url-loader!@site/static/img/home/social/discord.svg")
              .default
          }
        />
      </a>
      <a href="https://twitter.com/joinrune" target="_blank" rel="noreferrer">
        <img
          alt="Twitter Logo"
          src={
            require("!!url-loader!@site/static/img/home/social/twitter.svg")
              .default
          }
        />
      </a>
    </>
  )

  return (
    <>
      <div className={styles.footer}>
        <div className={styles.line}>
          <div className={clsx(styles.link, styles.side)}>
            {footerCopyright}
          </div>
          <div className={styles.center}>{footerLinks}</div>
          <div className={clsx(styles.side, styles.social)}>{footerSocial}</div>
        </div>
      </div>

      <div className={styles.footerMobile}>
        <div className={styles.links}>{footerLinks}</div>
        <div className={styles.social}>{footerSocial}</div>
        <div className={styles.link}>{footerCopyright}</div>
      </div>
    </>
  )
}
export default React.memo(Footer)
