import React from "react"

export function Social() {
  return (
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
}
