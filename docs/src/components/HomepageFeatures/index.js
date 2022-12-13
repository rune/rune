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
            <h2>Mobile and global reach</h2>
            <p>
              Building a game is fun, but having tons of people actually playing
              it makes the whole thing twice as fun. Rune makes your HTML5 games
              playable on mobile with an instant reach of{" "}
              <strong>5+ million players</strong>.
            </p>
            <p>
              We promote your game for free on our social channels and also
              provide valuable analytics and feedback on your game.
            </p>
            <p>
              No pesky ads or nags – <strong>just pure fun</strong>.
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
              <img src={socialCircular} />
              <div>
                <h2>Social</h2>
                <p>
                  Rune includes <strong>messaging</strong> and{" "}
                  <strong>voice chat</strong> so players can play together with{" "}
                  <strong>multiplayer support</strong>.
                </p>
              </div>
            </div>
          </div>
          <div className={clsx("col col--4")}>
            <div className={styles.engageContent}>
              <img src={engagingCircular} />
              <div>
                <h2>Engaging</h2>
                <p>
                  Keep your players coming back long after release with
                  Rune&apos;s built-in <strong>leaderboards</strong> and{" "}
                  <strong>daily challenges</strong>.
                </p>
              </div>
            </div>
          </div>
          <div className={clsx("col col--4")}>
            <div className={styles.engageContent}>
              <img src={sharableCircular} />
              <div>
                <h2>Shareable</h2>
                <p>
                  Players can comment, and{" "}
                  <strong>
                    share your game to friends without having to install the app
                  </strong>{" "}
                  or sign up.
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
            {`// Your game setup code...

Rune.init({
  resumeGame: () => game.resume(),
  pauseGame: () => game.pause(),
  restartGame: () => game.restart(),
  getScore: () => game.score,
})

// When the player loses the game, inform the SDK
Rune.gameOver()
`}
          </CodeBlock>
        </div>
        <div className={`${clsx("col col--6")} ${styles.superEasyText}`}>
          <h2>It&apos;s super easy</h2>
          <p>
            Integrating the Rune SDK is only a{" "}
            <strong>handful lines of code</strong> and can be done in a matter
            of minutes. The game can be built in any framework that export to
            HTML, such as Unity, Godot, Defold or GameMaker.
          </p>
          <p>
            <strong>We solve the difficult and boring parts</strong> like
            collaborative real-time networking, global distribution, user
            accounts, voice chat, etc so that you can focus on the game play.
            Just upload your game and Rune will do the rest...
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
