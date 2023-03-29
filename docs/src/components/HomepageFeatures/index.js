import React from "react"
import clsx from "clsx"
import CodeBlock from "@theme/CodeBlock"
import styles from "./styles.module.css"
import sharableCircular from "!!url-loader!@site/static/img/sharable-circular.svg"
import socialCircular from "!!url-loader!@site/static/img/social-circular.svg"
import engagingCircular from "!!url-loader!@site/static/img/engaging-circular.svg"

function MobileReady() {
  return (
    <div className="container">
      <div className="row">
        <div className={clsx("col col--6")}>
          <div className={styles.mobileReadyScreens}>
            <div className={styles.phoneOutline}>
              <img
                src={
                  require("@site/static/img/games/lazer-loop-poster.png")
                    .default
                }
              />
            </div>
            <div className={styles.phoneOutline}>
              <video
                poster={
                  require("@site/static/img/games/flip-jump-poster.png").default
                }
                muted
                playsInline
                autoPlay
                loop
              >
                <source
                  src={
                    require("@site/static/img/games/flip-jump-h265.mp4").default
                  }
                  type="video/mp4; codecs=hevc"
                />
                <source
                  src={
                    require("@site/static/img/games/flip-jump-h264.mp4").default
                  }
                  type="video/mp4; codecs=avc1"
                />
                <source
                  src={
                    require("@site/static/img/games/flip-jump-vp8.webm").default
                  }
                  type="video/webm"
                />
              </video>
            </div>
            <div className={styles.phoneOutline}>
              <img
                src={
                  require("@site/static/img/games/pet-hop-poster.png").default
                }
              />
            </div>
          </div>
        </div>
        <div className={`${clsx("col col--6")} ${styles.mobileReadyText}`}>
          <div className="padding-vert--md">
            <h2>Mobile multiplayer</h2>
            <p>
              Building a game is fun, but having tons of people actually playing
              it makes everything twice as fun. Rune makes it easy to make{" "}
              <strong>multiplayer HTML5 games for mobile</strong> reaching
              million of players!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Engage() {
  return (
    <div className={styles.engageContainer}>
      <div className="container">
        <div className="row">
          <div className={clsx("col col--4")}>
            <div className={styles.engageContent}>
              <img src={sharableCircular} />
              <div>
                <h2>Social</h2>
                <p>
                  Rune has <strong>messaging</strong> and{" "}
                  <strong>voice chat</strong> so players can hang out together
                  and talk about your game.
                </p>
              </div>
            </div>
          </div>
          <div className={clsx("col col--4")}>
            <div className={styles.engageContent}>
              <img src={socialCircular} />
              <div>
                <h2>Fast & Reliable</h2>
                <p>
                  Our <strong>predict-rollback netcode</strong> updates clients
                  immediately and the server resolves any conflicts.
                </p>
              </div>
            </div>
          </div>
          <div className={clsx("col col--4")}>
            <div className={styles.engageContent}>
              <img src={engagingCircular} />
              <div>
                <h2>Free</h2>
                <p>
                  We pay for servers, voice chat, and everything else. It's{" "}
                  <strong>100% free</strong> to launch your game on Rune.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SuperEasy() {
  return (
    <div className="container">
      <div className="row padding-top--lg">
        <div className={clsx("col col--6")}>
          <CodeBlock language="js">
            {`// Example action
kickBall: ({ direction, speed }, { game }) => {
  game.ballPosition = game.ballPosition + (direction * speed)
  
  if (scoredGoal(game.ballPosition)) {
    Rune.gameOver()
  }
}
`}
          </CodeBlock>
        </div>
        <div className={`${clsx("col col--6")} ${styles.superEasyText}`}>
          <h2>It&apos;s super easy</h2>
          <p>
            Write your game logic as actions using the expressiveness and
            simplicity of JavaScript. Your game client can be built in any
            framework that exports to web such as Phaser, PixiJS, PlayCanvas,
            React, Unity, or Godot.
          </p>
          <p>
            <strong>We solve the difficult and boring parts</strong> like
            networking, server hosting, user accounts, voice chat, etc. so that
            you can focus on the game logic. Just upload your game and Rune will
            do the rest...
          </p>
        </div>
      </div>
    </div>
  )
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <MobileReady />
      <Engage />
      <SuperEasy />
    </section>
  )
}
