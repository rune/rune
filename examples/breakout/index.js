const colors = [
  "blue",
  "darkblue",
  "cyan",
  "darkcyan",
  "red",
  "darkred",
  "orange",
  "darkorange",
  "magenta",
  "darkmagenta",
  "green",
  "darkgreen",
]

function getNextColor() {
  const color = colors.shift()
  colors.push(color)
  return color
}

shuffleArray(colors)

const game = new Game({
  onGameOver,

  ballColor: getNextColor(),
  ballX: getRandomArbitrary(0.1, 0.9),
  ballY: getRandomArbitrary(0.7, 0.8),
  ballGoesRight: getRandomArbitrary(0, 1) > 0.5,

  paddleColor: getNextColor(),
  paddlePosition: getRandomArbitrary(0.2, 0.8),

  brickColumns: getRandomIntInclusive(3, 5),
  brickRows: getRandomIntInclusive(3, 5),
  brickColor: getNextColor(),
})

if (Rune) {
  Rune.init({
    resumeGame: () => {
      game.start()
    },
    pauseGame: () => {
      game.pause()
    },
    restartGame: () => {
      game.restart()
    },
    getScore: () => {
      return game.score
    },
  })
} else {
  game.start()
}

function onGameOver() {
  if (Rune) Rune.gameOver()
}

function random() {
  if (Rune) return Rune.deterministicRandom()
  return Math.random()
}
