import PropTypes from "prop-types"
import React from "react"
import styles from "./styles.module.css"

export function MultiplayerExamples({ data }) {
  return (
    <ul className={styles.examples}>
      {data.map((example) => (
        <li key={example.slug}>
          <a href={`/examples/${example.slug}/`}>
            <img src={example.src} />
          </a>
          <h2>{example.title}</h2>
          <a href={`/examples/${example.slug}/`}>Demo</a> |{" "}
          <a
            href={`https://github.com/rune/rune/tree/staging/examples/${example.slug}`}
          >
            Source
          </a>
          <p>{example.description}</p>
        </li>
      ))}
    </ul>
  )
}

MultiplayerExamples.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      src: PropTypes.string.isRequired,
    })
  ).isRequired,
}
