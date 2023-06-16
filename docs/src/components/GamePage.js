import PropTypes from "prop-types"
import React, { useEffect } from "react"
import Layout from "@theme/Layout"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"

export function GamePage({ title, slug }) {
  const isMobile = "ontouchstart" in window
  const { siteConfig } = useDocusaurusContext()

  useEffect(() => {
    if (!isMobile) return

    document.body.style.overflow = "hidden"

    // MutationObserver is needed because side-menu resets body overflow style
    // when it closes, so we need to reset it back
    const observer = new MutationObserver(() => {
      document.body.style.overflow = "hidden"
    })

    observer.observe(document.body, { attributeFilter: ["style"] })

    return () => {
      observer.disconnect()
      document.body.style.overflow = "auto"
    }
  }, [])

  return (
    <Layout
      title={title}
      description={siteConfig.description}
      noFooter={isMobile}
    >
      <iframe
        src={`/_examples/${slug}/?embedded=1&enableInitialOverlayInBrowser=1`}
        style={{
          width: "100%",
          // svh is important because it takes into account mobile browser bottom nav bar
          height: "calc(100svh - var(--ifm-navbar-height))",
        }}
      />
    </Layout>
  )
}

GamePage.propTypes = {
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
}
