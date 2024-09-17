import clsx from "clsx"
import React, { useEffect, useState, useCallback } from "react"
import styles from "./HomeGameDemo.module.scss"

const numDots = 10
const delay = 1000
const latency = (delay + 100) / 2
const highlightFor = (delay / numDots) * 2

export function HomeGameDemo() {
  const [dots, setDots] = useState(() =>
    new Array(numDots).fill(1).map(() => ({
      highlightCount: 0,
    }))
  )
  const [serverHighlighted, setServerHighlighted] = useState(false)

  const scheduleAnimation = useCallback((ltr) => {
    const timeouts = []

    for (let t = 0; t < dots.length; t++) {
      let i = ltr ? t : dots.length - t - 1

      i = i >= dots.length / 2 ? dots.length - 1 - (i - 5) : i

      const delayInsideServer = 2

      const showFor =
        (t >= 5 ? t + delayInsideServer : t) *
        (delay / (dots.length + delayInsideServer))

      timeouts.push(
        setTimeout(() => {
          if (t === dots.length / 2 - 1) {
            setServerHighlighted(true)
          }

          setDots((prev) => {
            prev[i].highlightCount++
            return [...prev]
          })
        }, showFor)
      )

      timeouts.push(
        setTimeout(() => {
          if (t === dots.length / 2 - 1) {
            setServerHighlighted(false)
          }

          setDots((prev) => {
            prev[i].highlightCount--
            return [...prev]
          })
        }, showFor + highlightFor)
      )
    }

    return () => timeouts.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    function onMessage(event) {
      if (typeof event.data === "object" && "clientAction" in event.data) {
        scheduleAnimation(event.data.clientAction.userIndex === 0)
      }
    }

    window.addEventListener("message", onMessage)

    return () => window.removeEventListener("message", onMessage)
  }, [])

  const url = `/_examples/tic-tac-toe/?devDemo=${JSON.stringify({
    latency,
  })}&embedded=1&devuiSettingsKey=homeGameDemo`

  return (
    <>
      <div className={styles.server}>
        <div
          className={clsx(styles.serverHighlight, {
            [styles.highlighted]: serverHighlighted,
          })}
          style={{
            transition: `all ${highlightFor}ms ease-in-out`,
          }}
        />
        <p className={styles.subtitle}>
          Your game logic on Rune&apos;s&nbsp;servers
        </p>
        {dots.map((dot, i) => {
          const left = i < dots.length / 2
          const sideI = i % (dots.length / 2)

          return (
            <div
              key={i}
              className={clsx(styles.dot, left ? styles.left : styles.right, {
                [styles.highlighted]: dot.highlightCount > 0,
              })}
              style={{
                transition: `all ${highlightFor / 2}ms ease-in-out`,
                transform: `translate(${
                  (sideI * 30 + sideI ** 2 * (dots.length / 2)) *
                  (left ? 1 : -1)
                }px, -${sideI * 50 - sideI ** 2 * (dots.length / 2)}px)`,
              }}
            />
          )
        })}
      </div>
      <iframe className={styles.gameFrame} src={url} />
    </>
  )
}
