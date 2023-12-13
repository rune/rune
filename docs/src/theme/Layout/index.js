import React, { useEffect } from "react"
import Layout from "@theme-original/Layout"

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
                  no-repeat bottom -765px left calc(50% + 100px) / 2118px 2058px,
                #1b0329;

              @media (max-width: 996px) {
                background: url(${require("!!url-loader!@site/static/img/layout/background-top-mobile.svg")
                      .default})
                    no-repeat top 70px left calc(50% - 25px) / 1094px 3568px,
                  url(${require("!!url-loader!@site/static/img/layout/background-footer-mobile.svg")
                      .default})
                    no-repeat bottom -396px left calc(50% + 137px) / 856px 1339px,
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

  return <Layout {...props} />
}
