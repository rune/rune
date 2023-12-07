import React, { useEffect } from "react"
import Layout from "@theme-original/Layout"

const css = (strings, ...expressions) =>
  strings.reduce((acc, curr, i) => acc + curr + (expressions[i] || ""), "")

export default function LayoutWrapper(props) {
  const { homeBackground } = props

  useEffect(() => {
    if (!homeBackground) return

    const style = document.createElement("style")

    style.innerHTML = css`
      html,
      body {
        height: auto !important;
      }

      body {
        background: url(${require("!!url-loader!@site/static/img/home/background-top.svg")
              .default})
            no-repeat top 40px left calc(50% - 300px) / 2274px 2579px,
          url(${require("!!url-loader!@site/static/img/home/background-footer.svg")
              .default})
            no-repeat bottom -765px left calc(50% + 100px) / 2118px 2058px,
          #1b0329;

        @media (max-width: 700px) {
          background: url(${require("!!url-loader!@site/static/img/home/background-top-mobile.svg")
                .default})
              no-repeat top 70px left calc(50% - 25px) / 1094px 1811px,
            url(${require("!!url-loader!@site/static/img/home/background-footer-mobile.svg")
                .default})
              no-repeat bottom -396px left calc(50% + 137px) / 856px 1339px,
            #1b0329;
        }
      }
    `

    document.head.appendChild(style)

    return () => document.head.removeChild(style)
  }, [])

  return <Layout {...props} />
}
