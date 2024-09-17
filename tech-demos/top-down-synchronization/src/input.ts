// A simple input system using only browser based APIs. As with
// rendering in a real game you can use whatever input framework
// you choose.
import { Controls } from "./logic"

// The state of the local player's inputs
export const gameInputs: Controls = {
  left: false,
  right: false,
  up: false,
  down: false,
}

// Since we want to test this tech demo in the Rune Dev UI we'll
// adapt our input controls for touch devices vs desktop
const touchDevice = "ontouchstart" in document.documentElement
const controls = document.getElementById("controls") as HTMLImageElement
let mousePressed = false

// whichever type of input we're using we're going to abstract
// it in the same change - i.e. if we're pressing on a screen
// control or a key on the keyboard we're just going to adjust
// the local players state
function press(x: number, y: number) {
  const rect = controls.getBoundingClientRect()
  const tx = -1 + Math.floor((x - rect.left) / (rect.width / 3))
  const ty = -1 + Math.floor((y - rect.top) / (rect.height / 3))

  gameInputs.left = tx == -1
  gameInputs.right = tx == 1
  gameInputs.up = ty == -1
  gameInputs.down = ty == 1
}

function release() {
  gameInputs.left = false
  gameInputs.right = false
  gameInputs.up = false
  gameInputs.down = false
}

// if we're testing on a touch device then use touchstart/touchmove/touchend.
// we're being a bit idealistic here and only considering the first touch.
if (touchDevice) {
  controls.addEventListener("touchstart", (e: TouchEvent) => {
    press(e.touches[0].clientX, e.touches[0].clientY)
  })
  controls.addEventListener("touchmove", (e: TouchEvent) => {
    press(e.touches[0].clientX, e.touches[0].clientY)
  })
  window.addEventListener("touchend", () => {
    release()
  })
} else {
  // if we're running on desktop we'll use mousedown/mousemove/mouseup along
  // with keyboard controls for testing. You don't have to do
  // this if you're only considering the Rune mobile app.
  controls.addEventListener("mousedown", (e: MouseEvent) => {
    press(e.clientX, e.clientY)
    mousePressed = true
  })
  controls.addEventListener("mousemove", (e: MouseEvent) => {
    if (mousePressed) {
      press(e.clientX, e.clientY)
    }
  })
  window.addEventListener("mouseup", () => {
    release()
    mousePressed = false
  })

  // add some keyboard controls to be able to test
  // it in the DevUI easily
  window.addEventListener("keydown", (e: KeyboardEvent) => {
    gameInputs.left =
      e.key === "ArrowLeft" || e.key === "a" ? true : gameInputs.left
    gameInputs.right =
      e.key === "ArrowRight" || e.key == "d" ? true : gameInputs.right
    gameInputs.up = e.key === "ArrowUp" || e.key === "w" ? true : gameInputs.up
    gameInputs.down =
      e.key === "ArrowDown" || e.key == "s" ? true : gameInputs.down
  })

  window.addEventListener("keyup", (e: KeyboardEvent) => {
    gameInputs.left =
      e.key === "ArrowLeft" || e.key === "a" ? false : gameInputs.left
    gameInputs.right =
      e.key === "ArrowRight" || e.key == "d" ? false : gameInputs.right
    gameInputs.up = e.key === "ArrowUp" || e.key === "w" ? false : gameInputs.up
    gameInputs.down =
      e.key === "ArrowDown" || e.key == "s" ? false : gameInputs.down
  })
}
