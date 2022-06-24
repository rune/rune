const game = new Game({
  onGameOver: () => {
    Rune.gameOver()
  },
  options: gameOptions,
})

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
