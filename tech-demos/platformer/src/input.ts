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

// Since we want to test this tech demo in the Dusk Dev UI we'll
// adapt our input controls for touch devices vs desktop
const touchDevice = "ontouchstart" in document.documentElement
const left = document.getElementById("left") as HTMLImageElement
const right = document.getElementById("right") as HTMLImageElement
const jump = document.getElementById("jump") as HTMLImageElement

// if we're testing on a touch device then use touchstart/touchmove/touchend.
// we're being a bit idealistic here and only considering the first touch.
if (touchDevice) {
  let leftTouch = 0;
  let rightTouch = 0;
  let jumpTouch = 0;

  function touchEnd(id: number) {
    if (leftTouch === id) {
      gameInputs.left = false;
      leftTouch = 0;
    }
    if (rightTouch === id) {
      gameInputs.right = false;
      rightTouch = 0;
    }
    if (jumpTouch === id) {
      gameInputs.jump = false;
      jumpTouch = 0;
    }
  }
  left.addEventListener("touchstart", (e) => {
    leftTouch = e.touches[0].identifier;
    gameInputs.left = true;
  })
  right.addEventListener("touchstart", (e) => {
    rightTouch = e.touches[0].identifier;
    gameInputs.right = true;
  })
  jump.addEventListener("touchstart", (e) => {
    jumpTouch = e.touches[0].identifier;
    gameInputs.jump = true;
  })
  window.addEventListener("touchend", (e) => {
    touchEnd(e.touches[0].identifier);
  })
} else {
  left.addEventListener("mousedown", () => {
    gameInputs.left = true;
  })
  right.addEventListener("mousedown", () => {
    gameInputs.right = true;
  })
  jump.addEventListener("mousedown", () => {
    gameInputs.jump = true;
  })
  window.addEventListener("mouseup", () => {
    gameInputs.left = false;
    gameInputs.right = false;
    gameInputs.jump = false;
  })

  // add some keyboard controls to be able to test
  // it in the DevUI easily
  window.addEventListener("keydown", (e: KeyboardEvent) => {
    gameInputs.left =
      e.key === "ArrowLeft" || e.key === "a" ? true : gameInputs.left
    gameInputs.right =
      e.key === "ArrowRight" || e.key == "d" ? true : gameInputs.right
    gameInputs.jump = e.key === " " ? true : gameInputs.jump
  })

  window.addEventListener("keyup", (e: KeyboardEvent) => {
    gameInputs.left =
      e.key === "ArrowLeft" || e.key === "a" ? false : gameInputs.left
    gameInputs.right =
      e.key === "ArrowRight" || e.key == "d" ? false : gameInputs.right
    gameInputs.jump = e.key === " " ? false : gameInputs.jump
  })
}
