import React, { useState, useRef, useCallback } from "react"
import clsx from "clsx"
import Link from "@docusaurus/Link"
import { Player } from "@lottiefiles/react-lottie-player"
import CodeBlock from "@theme/CodeBlock"

import styles from "./index.module.scss"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"
import Layout from "@theme/Layout"
import { HomeGameDemo } from "../components/HomeGameDemo/HomeGameDemo"
import demoCode from "./demoCode.json"

const features = [
  {
    icon: require("@site/static/img/home/features/players.png").default,
    title: "Millions playing your game on Dusk",
    description: [
      "The Dusk app has more than 10 million installs across iOS and Android.",
      "No need for you to deal with marketing or pay for ads!",
    ],
  },
  {
    icon: require("@site/static/img/home/features/code.png").default,
    title: "Use your favorite web framework",
    description: [
      "Your game can use any web framework such as React, Svelte, Vue, r3f, PixiJS.",
      "It runs smoothly inside the Dusk app using a highly-optimized WebView.",
    ],
  },
  {
    icon: require("@site/static/img/home/features/heart.png").default,
    title: "It’s free for everyone",
    description: [
      "Dusk is completely free for developers and players alike!",
      "We will cover our costs through a small cut on any money we help devs make.",
    ],
  },
  {
    icon: require("@site/static/img/home/features/dollar.png").default,
    title: "We help you make money (coming soon!)",
    description: [
      "Earn money from your game without dealing with ads or purchases.",
      "Dusk's creator fund pays you directly based on your game's stats.",
    ],
  },
  {
    icon: require("@site/static/img/home/features/headset.png").default,
    title: "Voice chat and social built into Dusk",
    description: [
      "The Dusk app has friends, messaging, spectating and voice chat.",
      "Dusk turns your game into an incredible multiplayer experience!",
    ],
  },
]

const videos = [
  {
    game: {
      title: "Spooky Cookie",
      developers: [
        {
          name: "alexwoods",
          avatar:
            "https://app.dusk.gg/avatar?base=2&hair=29&tilt=1&headgear=55&accessory=64&background=72&expression=18&size=90&isCropped=1&isBackgroundTransparent=0",
        },
      ],
      minPlayers: 1,
      maxPlayers: 2,
    },
    poster:
      require("@site/static/img/home/games/thumbnails/SpookyCookie.mp4.png")
        .default,
    sources: [
      {
        src: require("@site/static/img/home/games/SpookyCookie.mp4.mp4")
          .default,
        type: "video/mp4",
      },
      {
        src: require("@site/static/img/home/games/SpookyCookie.webmhd.webm")
          .default,
        type: "video/webm",
      },
    ],
  },
  {
    game: {
      title: "Rock Paper Shoot",
      developers: [
        {
          name: "KIO Studios",
          avatar:
            "https://app.dusk.gg/avatar?base=12&hair=24&tilt=1&headgear=60&accessory=62&background=75&expression=17&size=90&isCropped=1&isBackgroundTransparent=0",
        },
      ],
      minPlayers: 2,
      maxPlayers: 2,
    },
    poster:
      require("@site/static/img/home/games/thumbnails/RockPaperShoot.mp4.png")
        .default,
    sources: [
      {
        src: require("@site/static/img/home/games/RockPaperShoot.mp4.mp4")
          .default,
        type: "video/mp4",
      },
      {
        src: require("@site/static/img/home/games/RockPaperShoot.webmhd.webm")
          .default,
        type: "video/webm",
      },
    ],
  },
  {
    game: {
      title: "Tavern Party",
      developers: [
        {
          name: "wawasensei",
          avatar:
            "https://app.dusk.gg/avatar?base=10&hair=20&tilt=1&headgear=61&accessory=67&background=71&expression=16&size=90&isCropped=1&isBackgroundTransparent=0",
        },
      ],
      minPlayers: 1,
      maxPlayers: 4,
    },
    poster:
      require("@site/static/img/home/games/thumbnails/TavernParty.mp4.png")
        .default,
    sources: [
      {
        src: require("@site/static/img/home/games/TavernParty.mp4.mp4").default,
        type: "video/mp4",
      },
      {
        src: require("@site/static/img/home/games/TavernParty.webmhd.webm")
          .default,
        type: "video/webm",
      },
    ],
  },
  {
    game: {
      title: "Pipeline Panic",
      developers: [
        {
          name: "json",
          avatar:
            "https://app.dusk.gg/avatar?base=5&hair=43&tilt=1&headgear=59&accessory=67&background=95&expression=15&size=90&isCropped=1&isBackgroundTransparent=0",
        },
        {
          name: "viturowski",
          avatar:
            "https://app.dusk.gg/avatar?base=12&hair=30&tilt=0&headgear=55&accessory=67&background=73&expression=15&size=90&isCropped=1&isBackgroundTransparent=0",
        },
      ],
      minPlayers: 1,
      maxPlayers: 4,
    },
    poster:
      require("@site/static/img/home/games/thumbnails/PipelinePanic.mp4.png")
        .default,
    sources: [
      {
        src: require("@site/static/img/home/games/PipelinePanic.mp4.mp4")
          .default,
        type: "video/mp4",
      },
      {
        src: require("@site/static/img/home/games/PipelinePanic.webmhd.webm")
          .default,
        type: "video/webm",
      },
    ],
  },
  {
    game: {
      title: "Neon Snake",
      developers: [
        {
          name: "Helios1138",
          avatar:
            "https://app.dusk.gg/avatar?base=2&hair=44&tilt=0&headgear=56&accessory=66&background=72&expression=14&size=90&isCropped=1&isBackgroundTransparent=0",
        },
        {
          name: "shanehelm",
          avatar:
            "https://app.dusk.gg/avatar?base=9&hair=49&tilt=1&headgear=76&accessory=66&background=97&expression=15&size=90&isCropped=1&isBackgroundTransparent=0",
        },
      ],
      minPlayers: 1,
      maxPlayers: 4,
    },
    poster: require("@site/static/img/home/games/thumbnails/NeonSnake.mp4.png")
      .default,
    sources: [
      {
        src: require("@site/static/img/home/games/NeonSnake.mp4.mp4").default,
        type: "video/mp4",
      },
      {
        src: require("@site/static/img/home/games/NeonSnake.webmhd.webm")
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

  return (
    <>
      <div className={styles.gameInfo}>
        <div className={styles.author}>
          {currentVideo.game.developers.map(({ avatar }) => (
            <img key={avatar} alt="avatar" src={avatar} />
          ))}
          <span>
            {currentVideo.game.developers.map((d) => d.name).join(" & ")}
          </span>
        </div>
        <div className={styles.game}>
          <span>{currentVideo.game.title}</span>
          <div className={styles.info}>
            <img
              src={
                require("!!url-loader!@site/static/img/home/players.svg")
                  .default
              }
            />
            <span>
              {currentVideo.game.minPlayers === currentVideo.game.maxPlayers
                ? currentVideo.game.minPlayers
                : `${currentVideo.game.minPlayers}-${currentVideo.game.maxPlayers}`}
            </span>
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
              autoPlay
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
  const { siteConfig } = useDocusaurusContext()
  const [selectedFile, setSelectedFile] = useState("logic")

  return (
    <Layout description={siteConfig.description} homeBackground>
      <div className={styles.home}>
        <div className={styles.content}>
          <div className={styles.hero1}>
            <Phone />

            <h2>build a multiplayer game played by millions</h2>
            <p>
              Your game runs inside the Dusk app with 10 million installs across
              iOS and Android.
            </p>
            <div className={styles.ctaButtons}>
              <Link className={styles.ctaButton} to="/docs/quick-start">
                Get Started
              </Link>
              <a
                className={clsx(styles.ctaButton, styles.blue)}
                href="https://discord.gg/dusk-devs"
                target="_blank"
                rel="noreferrer"
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
            <h3>you focus on your game, we handle everything&nbsp;else</h3>
            <div className={styles.featuresOuter}>
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
                    <div className={styles.mainMobile}>
                      <h5>{title}</h5>
                      <p>{description.join(" ")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.hero3}>
            <h3>no backend needed</h3>
            <HomeGameDemo />
            <p className={styles.description}>
              You write your game logic in JavaScript and Dusk runs it on
              servers all over the world for low latency. Our predict-rollback
              approach removes the need for any game networking code and ensures
              that players have an amazing experience even on bad internet.
            </p>
          </div>

          <div className={styles.hero4}>
            <h3>multiplayer in 100 lines&nbsp;of&nbsp;JS</h3>
            <p>
              Here’s the code for the Tic Tac Toe game above. The game has
              built-in voice chat, matchmaking, and spectating. All powered by
              Dusk!
            </p>
            <div className={styles.codeContainer}>
              <div className={styles.buttons}>
                <div
                  className={clsx(styles.button, {
                    [styles.active]: selectedFile === "logic",
                  })}
                  onClick={() => setSelectedFile("logic")}
                >
                  logic.js
                </div>
                <div
                  className={clsx(styles.button, {
                    [styles.active]: selectedFile === "client",
                  })}
                  onClick={() => setSelectedFile("client")}
                >
                  client.js
                </div>
              </div>
              <CodeBlock language="js" showLineNumbers>
                {selectedFile === "logic" ? demoCode.logic : demoCode.client}
              </CodeBlock>
            </div>
          </div>

          <div className={styles.cta}>
            <h3>use your favorite web framework</h3>
            <Link className={styles.ctaButton} to="/docs/quick-start">
              Get Started
            </Link>
            <div className={styles.starsContainer}>
              <Player
                autoplay
                loop
                speed={0.25}
                src={require("@site/static/img/home/starsLottie.json")}
                className={styles.stars}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
