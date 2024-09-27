import PropTypes from "prop-types"
import React, { useEffect } from "react"
import Layout from "@theme/Layout"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"

//Allow game to take more space
const cssFooterFixes = `
  div.footer_src-theme-Footer-index-module {
    height: 80px;
  }
`

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
    <>
      <Layout
        title={title}
        description={siteConfig.description}
        noFooter={isMobile}
      >
        <style>{cssFooterFixes}</style>
        <iframe
          src={`/_${
            techDemo ? "tech-demos" : "examples"
          }/${slug}/?embedded=1&devuiSettingsKey=${slug}&embeddedType=${type}&embeddedSlug=${slug}`}
          style={{
            width: "100%",
            // svh is important because it takes into account mobile browser bottom nav bar
            height: isMobile
              ? "calc(100svh - var(--ifm-navbar-height)"
              : //In games page we reduce footer from 180px to 80px, so we adjust by 100px to give it some space
                "calc(100svh - var(--ifm-navbar-height) - 100px",
          }}
        />
      </Layout>
    </>
  )
}

GamePage.propTypes = {
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  techDemo: PropTypes.bool,
}
