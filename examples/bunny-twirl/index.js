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
const text = new PIXI.Text(scoreText(score), {
  fontFamily: "Arial",
  fontSize: 12,
  fill: "white",
  align: "center",
})
text.position.x = 80
text.position.y = -50
text.anchor.set(0.5)
container.addChild(text)

// Listen for animate update
let isRunning = true
app.ticker.add((delta) => {
  // Skip if game is paused
  if (!isRunning) return

  // Rotate container and increment score (approx. 6.28 radians per rotation)
  container.rotation += 0.01 * delta
  score = Math.ceil(container.rotation / 6.28)
  text.text = scoreText(score)
})

// Setup functions for starting the game etc.
function startGame() {
  container.rotation = 0
  isRunning = true
}
function pauseGame() {
  isRunning = false
}
function resumeGame() {
  isRunning = true
}
function endGame() {
  isRunning = false
  text.text = `You gave up after ${score} twirls!`
  Rune.gameOver({ score })
}

// End game on click (i.e. player couldn't handle more twirls)
app.renderer.view.addEventListener("click", function () {
  endGame()
})

// Initialize Rune SDK with the start/pause/resume functions
Rune.init({
  startGame,
  pauseGame,
  resumeGame,
})
