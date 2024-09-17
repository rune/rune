import React, { useEffect } from "react"
import Layout from "@theme-original/Layout"
import BrowserOnly from "@docusaurus/BrowserOnly"

const css = (strings, ...expressions) =>
  strings.reduce((acc, curr, i) => acc + curr + (expressions[i] || ""), "")

export default function LayoutWrapper(props) {
  const { homeBackground } = props

  useEffect(() => {
    const style = document.createElement("style")

    style.innerHTML = css`
      html,
      body {
        height: auto !important;
      }

      ${homeBackground
        ? css`
            body {
              background: url(${require("!!url-loader!@site/static/img/layout/background-top.svg")
                    .default})
                  no-repeat top 40px left calc(50% - 300px) / 2326px 5761px,
                url(${require("!!url-loader!@site/static/img/layout/background-footer.svg")
                    .default})
                  no-repeat bottom -765px left calc(50% + 200px) / 2114px 3243px,
                #1b0329;

              @media (max-width: 996px) {
                background: url(${require("!!url-loader!@site/static/img/layout/background-top-mobile.svg")
                      .default})
                    no-repeat top 70px left calc(50% - 25px) / 1094px 3568px,
                  url(${require("!!url-loader!@site/static/img/layout/background-footer-mobile.svg")
                      .default})
                    no-repeat bottom -396px left calc(50% + 50px) / 856px 3256px,
                  #1b0329;
              }
            }
          `
        : css`
            body {
              background: url(${require("!!url-loader!@site/static/img/layout/background-docs.svg")
                    .default})
                  no-repeat top -314px left -517px / 1319px 676px fixed,
                #1b0329;

              @media (max-width: 996px) {
                background: url(${require("!!url-loader!@site/static/img/layout/background-docs-mobile.svg")
                      .default})
                    no-repeat top -200px left -300px / 819px 521px fixed,
                  #1b0329;
              }
            }
          `}
    `

    document.head.appendChild(style)

    return () => document.head.removeChild(style)
  }, [])

  return (
    <>
      <BrowserOnly>{() => <Banner />}</BrowserOnly>
      <Layout {...props} />
    </>
  )
}

function Banner() {
  const showBanner = location.hash === "#dusk"

  useEffect(() => {
    const style = document.createElement("style")

    style.innerHTML = css`
      .navbar--fixed-top {
        top: ${showBanner ? "48px" : "0"};
      }

      .banner {
        padding: 16px 80px;
        height: 48px;
        display: flex;
        justify-content: center;
        align-items: center;

        background: linear-gradient(88.45deg, #c887ff -2.7%, #ffa9a9 100%);
        color: #6d20ab;
        font-size: 18px;
        font-weight: 700;
        text-align: center;
        position: sticky;
        top: 0;
        z-index: 2;
      }
      .banner a {
        color: #6d20ab;
      }
      .banner a:hover {
        text-decoration: none;
      }

      .banner > .banner-content {
        display: flex;
        flex: 1;
        justify-content: space-between;
      }

      @media screen and (max-width: 996px) {
        .banner {
          padding: 12px 24px;
          font-size: 16px;
        }

        .banner .text > span:nth-child(2) {
          display: none;
        }
      }
    `
    document.head.appendChild(style)

    return () => document.head.removeChild(style)
  }, [])

  if (!showBanner) return null

  return (
    <div class="banner">
      <div class="banner-content">
        <div class="text">
          <span>By popular demand, Dusk is now Rune again 🦙</span>
        </div>
      </div>
    </div>
  )
}
