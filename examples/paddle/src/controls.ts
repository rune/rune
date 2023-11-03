import { throttle } from "./helpers.ts"
import { GAME_WIDTH, PADDLE_WIDTH } from "./logic.ts"

let controlsInitialized = false
const MIN_MOVE_DISTANCE = 2

export function initControls(
  onMove: () => void,
  getIsPlayer: () => boolean,
  getPaddlePosition: () => number
) {
  if (controlsInitialized) {
    return
  }

  controlsInitialized = true

  let holdingPaddle = false

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
    // Don't send actions if player is spectator or trying to hold paddle still
    if (
      getIsPlayer() &&
      Math.abs(position - getPaddlePosition()) > MIN_MOVE_DISTANCE
    ) {
      Rune.actions.setPosition(position)
    }
  }, 100)

  window.addEventListener("pointerdown", (event) => {
    const cursor = calculatePosition(event.clientX)

    // Only move if player is holding paddle and moving it
    if (Math.abs(getPaddlePosition() - cursor) < PADDLE_WIDTH * 1.4) {
      holdingPaddle = true
      move(cursor)
    } else {
      holdingPaddle = false
    }
  })

  window.addEventListener("pointerup", () => {
    holdingPaddle = false
  })

  window.addEventListener("pointermove", (event) => {
    if (holdingPaddle) {
      const cursor = calculatePosition(event.clientX)
      move(cursor)

      onMove()
    }
  })
}
