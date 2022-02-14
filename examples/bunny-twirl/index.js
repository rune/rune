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
const text = new PIXI.Text(
  // Show devs that the game is waiting on startGame().
  // A real Rune game doesn't need to show text like this.
  "Waiting to start...",
  {
    fontFamily: "Arial",
    fontSize: 12,
    fill: "white",
    align: "center",
  }
)
text.position.x = 80
text.position.y = -50
text.anchor.set(0.5)
container.addChild(text)

// Keep track of whether to animate and if the player started playing
let isAnimating = true
let isPlaying = false

// Generate map
const challengeNumber = Rune.getChallengeNumber();
// const nextChallengeNumber = challengeNumber + 1;

// Derive rotation speed from Rune challenge number.
// See the README on using challenge number as a seed for randomness.
const random = new Math.seedrandom(challengeNumber)
const pseudoRandomNumber = random()
const minSpeed = 0.005
const maxSpeed = 0.03
const speed = pseudoRandomNumber * (maxSpeed - minSpeed) + minSpeed

// Derive direction (-1 or 1) from Rune challenge number.
// See the README on using challenge number to iterate through game content.
const directions = [-1, 1]
const direction = directions[(challengeNumber - 1) % directions.length]

// Listen for animate update
app.ticker.add((delta) => {
  // Skip if game is paused
  if (!isAnimating) return

  // Rotate container
  container.rotation += speed * delta * direction

  // Increment score if user started playing
  if (isPlaying) {
    score = Math.abs(Math.floor(container.rotation / (Math.PI * 2)))
    if (text.text !== scoreText(score)) text.text = scoreText(score)
  }
})

// Setup functions for starting the game etc.
function startGame() {
  // Reset score w/o changing container orientation by removing full rotations
  container.rotation = container.rotation % (Math.PI * 2)

  // Start actual gameplay
  isAnimating = true
  isPlaying = true
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
  Rune.gameOver()
}
function getScore() {
  return score
}

// End game on click / tap (i.e. player couldn't handle more twirls)
for (const eventType of ["click", "touchstart"]) {
  document.body.addEventListener(eventType, function () {
    if (!isPlaying) {
      // Don't do anything if the game hasn't started
    } else {
      endGame()
    }
  })
}

// Initialize Rune SDK with the start/pause/resume functions.
// Rune will call startGame() to let this game know to start the gameplay.
Rune.init({
  startGame,
  pauseGame,
  resumeGame,
  getScore,
})
