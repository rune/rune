import React from "react"
import clsx from "clsx"
import Link from "@docusaurus/Link"

import styles from "./index.module.scss"

// TODO: svg images via url loader!

const features = [
  {
    icon: require("@site/static/img/home/features/players.png").default,
    title: "Millions playing your game on Rune",
    description: [
      "The Rune app has more than 10 million installs across iOS and Android.",
      "No need for you to deal with marketing or pay for ads!",
    ],
  },
  {
    icon: require("@site/static/img/home/features/code.png").default,
    title: "Use your favorite web framework",
    description: [
      "Your game can use any web framework such as React, Svelte, Vue, r3f, PixiJS.",
      "It runs smoothly inside the Rune app using a highly-optimized WebView.",
    ],
  },
  {
    icon: require("@site/static/img/home/features/heart.png").default,
    title: "It’s free for everyone",
    description: [
      "Rune is completely free for developers and players alike!",
      "We cover our costs through a small cut on any money we help developers make.",
    ],
  },
  {
    icon: require("@site/static/img/home/features/dollar.png").default,
    title: "We help you make money",
    description: [
      "Players can soon spend Rune gems on your games.",
      "Earn money by adding skins and power-ups to your game!",
    ],
  },
  {
    icon: require("@site/static/img/home/features/headset.png").default,
    title: "Voice chat and social built into Rune",
    description: [
      "The Rune app has friends, messaging, spectating and voice chat.",
      "Rune turns your game into an incredible multiplayer experience!",
    ],
  },
]

export default function Home() {
  return (
    <div className={styles.home}>
      <div className={styles.header}>
        <div className={styles.left}>
          <Link to="/">
            <img
              alt="Rune Logo"
              className={styles.logo}
              src={require("@site/static/img/home/logo.png").default}
            />
          </Link>
        </div>
        <div className={styles.right}>
          <Link to="/docs/quick-start" className={styles.menuLink}>
            Docs
          </Link>
          <Link to="/faq" className={styles.menuLink}>
            FAQ
          </Link>
          <a
            href="https://github.com/rune/rune-games-sdk"
            target="_blank"
            className={styles.menuBtn}
          >
            <div className={styles.normal}>GitHub</div>
            <div className={styles.hover}>GitHub</div>
          </a>
        </div>
      </div>
      <div className={styles.content}>
        <h2 className={styles.hero1}>
          Build a multiplayer game played by millions
        </h2>
        <p>
          Your game runs inside the Rune app with 10 million installs across iOS
          and Android.
        </p>
        <div class={styles.ctaButtons}>
          <Link className={styles.ctaButton} to="/docs/quick-start">
            Get Started
          </Link>
          <a
            className={clsx(styles.ctaButton, styles.blue)}
            href="https://discord.gg/rune-devs"
            target="_blank"
          >
            <img
              alt="Discord Logo"
              src={require("@site/static/img/home/discord.png").default}
            />
            <span>Join Discord</span>
          </a>
        </div>
        <h2 className={styles.hero2}>
          You focus on your game, we handle everything else
        </h2>
        <div className={styles.features}>
          {features.map(({ icon, title, description }, idx) => (
            <div key={idx} className={styles.feature}>
              <img className={styles.icon} src={icon} />
              <div className={styles.main}>
                <h5>{title}</h5>
                {description.map((line, idx2) => (
                  <p key={idx2}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.cta}>
          <h3>Use your favorite web framework</h3>
          <Link className={styles.ctaButton} to="/docs/quick-start">
            Get Started
          </Link>
        </div>
      </div>
      <div className={styles.footer}>footer</div>
    </div>
  )
}
