import PropTypes from "prop-types"
import React, { useEffect } from "react"
import Layout from "@theme/Layout"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"

export function GamePage({ title, slug, techDemo }) {
  const type = techDemo ? "tech-demos" : "examples"
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
      <a
        className="menuLink_src-theme-Navbar-Layout-styles-module"
        style={{
          position: "absolute",
          padding: "8px",
          margin: "10px",
          background: "white",
          color: "#1b0329",
          borderRadius: "8px",
          lineHeight: "20px",
        }}
        href={`https://github.com/dusk-gg/dusk/tree/staging/${type}/${slug}`}
      >
        Source
      </a>
      <iframe
        src={`/_${
          techDemo ? "tech-demos" : "examples"
        }/${slug}/?embedded=1&devuiSettingsKey=${slug}`}
        style={{
          width: "100%",
          // svh is important because it takes into account mobile browser bottom nav bar
          height: isMobile
            ? "calc(100svh - var(--ifm-navbar-height)"
            : "calc(100svh - var(--ifm-navbar-height) - var(--ifm-footer-height)",
        }}
      />
    </Layout>
  )
}

GamePage.propTypes = {
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  techDemo: PropTypes.bool,
}
