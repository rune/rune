/*
Minimal game where the score keeps increasing until you click on the screen.

See more details in README.md.
*/

// Setup PixiJS application
const app = new PIXI.Application({
  width: 400,
  height: 400,
  backgroundColor: 0x1099bb,
  resolution: window.devicePixelRatio || 1,
})
document.body.appendChild(app.view)
const container = new PIXI.Container()
app.stage.addChild(container)

// Create a 5x5 grid of bunnies
const texture = PIXI.Texture.from("bunny.png")
for (let i = 0; i < 25; i++) {
  const bunny = new PIXI.Sprite(texture)
  bunny.anchor.set(0.5)
  bunny.x = (i % 5) * 40
  bunny.y = Math.floor(i / 5) * 40
  container.addChild(bunny)
}

// Move container to the center and center bunny sprites
container.x = app.screen.width / 2
container.y = app.screen.height / 2
container.pivot.x = container.width / 2
container.pivot.y = container.height / 2

// Add score text
function scoreText(score) {
  return `You've survived ${score} bunny twirls`
}
let score = 0
const text = new PIXI.Text("Tap to start!", {
  fontFamily: "Arial",
  fontSize: 12,
  fill: "white",
  align: "center",
})
text.position.x = 80
text.position.y = -50
text.anchor.set(0.5)
container.addChild(text)

// Keep track of whether to animate and if the player started playing
let isAnimating = true
let isPlaying = false

// Listen for animate update
app.ticker.add((delta) => {
  // Skip if game is paused
  if (!isAnimating) return

  // Rotate container
  container.rotation += 0.01 * delta

  // Increment score if user started playing (approx. 6.28 radians per rotation)
  if (isPlaying) {
    score = Math.floor(container.rotation / 6.28)
    if (text.text !== scoreText(score)) text.text = scoreText(score)
  }
})

// Setup functions for starting the game etc.
function startGame() {
  container.rotation = 0

  // Make user tap screen to actually start playing
  isAnimating = true
  isPlaying = false
  text.text = "Tap to start!"
}
function pauseGame() {
  isAnimating = false
}
function resumeGame() {
  isAnimating = true
}
function endGame() {
  isAnimating = false
  text.text = `You gave up after ${score} twirls!`
  Rune.gameOver({ score })
}

// End game on click / tap (i.e. player couldn't handle more twirls)
for (const eventType of ["click", "touchstart"]) {
  document.body.addEventListener(eventType, function () {
    if (!isPlaying) {
      // First tap should start gameplay
      isPlaying = true
    } else {
      endGame()
    }
  })
}

// Initialize Rune SDK with the start/pause/resume functions
Rune.init({
  startGame,
  pauseGame,
  resumeGame,
})
