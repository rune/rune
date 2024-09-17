// A simple input system using only browser based APIs. As with
// rendering in a real game you can use whatever input framework
// you choose.
import { Controls } from "./logic"

// The state of the local player's inputs
export const gameInputs: Controls = {
  left: false,
  right: false,
  jump: false,
}

// Since we want to test this tech demo in the Rune Dev UI we'll
// adapt our input controls for touch devices vs desktop
const touchDevice = "ontouchstart" in document.documentElement
const left = document.getElementById("left") as HTMLImageElement
const right = document.getElementById("right") as HTMLImageElement
const jump = document.getElementById("jump") as HTMLImageElement

// if we're testing on a touch device then use touchstart/touchmove/touchend.
// we're being a bit idealistic here and only considering the first touch.
if (touchDevice) {
  left.addEventListener("touchstart", () => {
    gameInputs.left = true
  })
  right.addEventListener("touchstart", () => {
    gameInputs.right = true
  })
  left.addEventListener("touchend", () => {
    gameInputs.left = false
  })
  right.addEventListener("touchend", () => {
    gameInputs.right = false
  })
  jump.addEventListener("touchstart", () => {
    gameInputs.jump = true
  })
  jump.addEventListener("touchend", () => {
    gameInputs.jump = false
  })
} else {
  left.addEventListener("mousedown", () => {
    gameInputs.left = true
  })
  right.addEventListener("mousedown", () => {
    gameInputs.right = true
  })
  jump.addEventListener("mousedown", () => {
    gameInputs.jump = true
  })
  window.addEventListener("mouseup", () => {
    gameInputs.left = false
    gameInputs.right = false
    gameInputs.jump = false
  })

  // add some keyboard controls to be able to test
  // it in the DevUI easily
  window.addEventListener("keydown", (e: KeyboardEvent) => {
    gameInputs.left =
      e.key === "ArrowLeft" || e.key === "a" ? true : gameInputs.left
    gameInputs.right =
      e.key === "ArrowRight" || e.key == "d" ? true : gameInputs.right
    gameInputs.jump =
      e.key === " " || e.key == "w" || e.key == "ArrowUp"
        ? true
        : gameInputs.jump
  })

  window.addEventListener("keyup", (e: KeyboardEvent) => {
    gameInputs.left =
      e.key === "ArrowLeft" || e.key === "a" ? false : gameInputs.left
    gameInputs.right =
      e.key === "ArrowRight" || e.key == "d" ? false : gameInputs.right
    gameInputs.jump =
      e.key === " " || e.key == "w" || e.key == "ArrowUp"
        ? false
        : gameInputs.jump
  })
}
