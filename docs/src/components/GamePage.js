import PropTypes from "prop-types"
import React from "react"
import Layout from "@theme/Layout"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"

export function GamePage({ title, slug }) {
  const { siteConfig } = useDocusaurusContext()

  return (
    <Layout title={title} description={siteConfig.description}>
      <iframe
        src={`/_examples/${slug}/?embedded=1`}
        style={{ width: "100%", height: "calc(100vh - 60px)" }}
      />
    </Layout>
  )
}

GamePage.propTypes = {
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
}
