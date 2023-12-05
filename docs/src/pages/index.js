import React, { useState, useRef, useEffect, useCallback } from "react"
import clsx from "clsx"
import Link from "@docusaurus/Link"

import styles from "./index.module.scss"

// TODO: more svg images via url loader!

// TODO: real videos and game info from DB

// TODO: v1 mobile header just use DOCS menu item instead of hamburger

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

const videos = [
  {
    poster: require("@site/static/img/games/flip-jump-poster.png").default,
    sources: [
      {
        src: require("@site/static/img/games/flip-jump-h265.mp4").default,
        type: "video/mp4; codecs=hevc",
      },
      {
        src: require("@site/static/img/games/flip-jump-h264.mp4").default,
        type: "video/mp4; codecs=avc1",
      },
      {
        src: require("@site/static/img/games/flip-jump-vp8.webm").default,
        type: "video/webm",
      },
    ],
  },
  {
    poster:
      require("@site/static/img/home/games/converted/TavernPartymp4.webmhd.png")
        .default,
    sources: [
      {
        src: require("@site/static/img/home/games/converted/TavernPartymp4.mp4.mp4")
          .default,
        type: "video/mp4",
      },
      {
        src: require("@site/static/img/home/games/converted/TavernPartymp4.webmhd.webm")
          .default,
        type: "video/webm",
      },
    ],
  },
]

const scrollDuration = 600

function Phone() {
  const [cursor, setCursor] = useState(0)

  const currentVideoIndex = cursor % videos.length
  const nextVideoIndex = (cursor + 1) % videos.length

  const currentVideo = videos[currentVideoIndex]
  const nextVideo = videos[nextVideoIndex]

  const currentVideoRef = useRef()
  const nextVideoRef = useRef()

  const [videoOffset, setVideoOffset] = useState(0)

  const scrollToNextVideo = useCallback(() => {
    nextVideoRef.current.currentTime = 0
    nextVideoRef.current.play()
    setVideoOffset(-100)

    setTimeout(() => {
      setVideoOffset(0)
      setCursor(cursor + 1)
    }, scrollDuration)
  }, [cursor])

  const scrollToNextVideoRef = useRef(scrollToNextVideo)
  scrollToNextVideoRef.current = scrollToNextVideo

  useEffect(() => {
    if (currentVideoRef.current) {
      currentVideoRef.current.currentTime = 0
      currentVideoRef.current.play()
    }
  }, [])

  return (
    <>
      <div className={styles.gameInfo}>
        <div className={styles.author}>
          <img
            alt="avatar"
            src="https://app.rune.ai/avatar?base=9&hair=49&tilt=1&headgear=76&accessory=66&background=97&expression=15&size=420&isCropped=1&isBackgroundTransparent=0"
          />
          <img
            alt="avatar"
            src="https://app.rune.ai/avatar?base=3&hair=36&tilt=0&headgear=58&accessory=84&background=69&expression=15&size=420&isCropped=1&isBackgroundTransparent=0"
          />
          <span>json & viturowski</span>
        </div>
        <div className={styles.game}>
          <span>Pipeline Panic</span>
          <div className={styles.info}>
            <img
              src={
                require("!!url-loader!@site/static/img/home/players.svg")
                  .default
              }
            />
            <span>1-4</span>
          </div>
        </div>
      </div>
      <div className={styles.phoneFrame}>
        <div className={styles.containerOuter}>
          <div
            className={styles.container}
            style={{
              transition:
                videoOffset === 0 ? "" : `top ${scrollDuration}ms ease-in`,
              top: `${videoOffset}%`,
            }}
          >
            <video
              key={currentVideoIndex}
              ref={currentVideoRef}
              poster={currentVideo.poster}
              muted
              playsInline
              onEnded={scrollToNextVideo}
            >
              {currentVideo.sources.map((source, idx) => (
                <source key={idx} src={source.src} type={source.type} />
              ))}
            </video>
            <video
              key={nextVideoIndex}
              ref={nextVideoRef}
              poster={nextVideo.poster}
              muted
              playsInline
            >
              {nextVideo.sources.map((source, idx) => (
                <source key={idx} src={source.src} type={source.type} />
              ))}
            </video>
          </div>
        </div>
      </div>
    </>
  )
}

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
        <div className={styles.hero1}>
          <Phone />

          <h2>Build a multiplayer game played by millions</h2>
          <p>
            Your game runs inside the Rune app with 10 million installs across
            iOS and Android.
          </p>
          <div className={styles.ctaButtons}>
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
        </div>

        <div className={styles.hero2}>
          <h2>You focus on your game, we handle everything else</h2>
          <div className={styles.features}>
            {features.map(({ icon, title, description }, idx) => (
              <div key={idx} className={styles.feature}>
                <img alt={title} className={styles.icon} src={icon} />
                <div className={styles.main}>
                  <h5>{title}</h5>
                  {description.map((line, idx2) => (
                    <p key={idx2}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.cta}>
          <h3>Use your favorite web framework</h3>
          <Link className={styles.ctaButton} to="/docs/quick-start">
            Get Started
          </Link>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.line}>
          <div className={clsx(styles.link, styles.side)}>
            © 2023 Rune AI, Inc.
          </div>
          <div className={styles.center}>
            <Link className={styles.link} to="/docs/quick-start">
              Docs
            </Link>
            <Link className={styles.link} to="/docs/examples">
              Examples
            </Link>
            <a className={styles.link} href="https://rune.ai" target="_blank">
              Get Rune
            </a>
            <a
              className={styles.link}
              href="https://rune.ai/team"
              target="_blank"
            >
              About
            </a>
          </div>
          <div className={clsx(styles.side, styles.social)}>
            <a href="https://github.com/rune/rune-games-sdk" target="_blank">
              <img
                alt="GitHub Logo"
                src={
                  require("!!url-loader!@site/static/img/home/social/github.svg")
                    .default
                }
              />
            </a>
            <a href="https://discord.gg/rune-devs" target="_blank">
              <img
                alt="Discord Logo"
                src={
                  require("!!url-loader!@site/static/img/home/social/discord.svg")
                    .default
                }
              />
            </a>
            <a href="https://twitter.com/joinrune" target="_blank">
              <img
                alt="Twitter Logo"
                src={
                  require("!!url-loader!@site/static/img/home/social/twitter.svg")
                    .default
                }
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
