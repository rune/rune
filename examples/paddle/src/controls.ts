import { throttle } from "./helpers.ts"
import { GAME_WIDTH, PADDLE_WIDTH } from "./logic.ts"

export function initControls() {
  const move = throttle((x: number) => {
    const position = Math.max(
      0,
      Math.min(
        Math.round((x / window.innerWidth) * GAME_WIDTH - PADDLE_WIDTH / 2),
        GAME_WIDTH - PADDLE_WIDTH
      )
    )

    Rune.actions.setDesiredPosition(position)
  }, 100)

  window.addEventListener("pointerdown", (event) => move(event.clientX))
  window.addEventListener("pointermove", (event) => {
    move(event.clientX)
  })
}
