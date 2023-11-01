import { throttle } from "./helpers.ts"
import { GAME_WIDTH, PADDLE_WIDTH } from "./logic.ts"

export function initControls(
  onMove: () => void,
  getPaddlePosition: () => number
) {
  let allowMove = false

  const calculatePosition = (x: number) => {
    return Math.max(
      0,
      Math.min(
        Math.round((x / window.innerWidth) * GAME_WIDTH - PADDLE_WIDTH / 2),
        GAME_WIDTH - PADDLE_WIDTH
      )
    )
  }

  const move = throttle((position: number) => {
    Rune.actions.setPosition(position)
  }, 100)

  window.addEventListener("pointerdown", (event) => {
    const paddle = getPaddlePosition()

    const cursor = calculatePosition(event.clientX)

    const distanceFromPaddleCenter = Math.abs(paddle - cursor)

    //Allow tapping 2 times the size of paddle
    if (distanceFromPaddleCenter < PADDLE_WIDTH) {
      allowMove = true
      move(cursor)
    } else {
      allowMove = false
    }
  })

  window.addEventListener("pointerup", (event) => {
    allowMove = false
  })

  window.addEventListener("pointermove", (event) => {
    if (allowMove) {
      const position = calculatePosition(event.clientX)

      move(position)

      onMove()
    }
  })
}
