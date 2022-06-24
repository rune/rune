const gameOptions = {
  ballColor: getRandomColor(),
  ballX: getRandomArbitrary(0.1, 0.9),
  ballY: getRandomArbitrary(0.7, 0.8),
  ballGoesRight: getRandomArbitrary(0, 1) > 0.5,

  brickColumns: getRandomIntInclusive(3, 5),
  brickRows: getRandomIntInclusive(3, 5),
  brickColor: getRandomColor(),

  paddleColor: getRandomColor(),
  paddlePosition: getRandomArbitrary(0.2, 0.8),
}

function getRandomColor() {
  return `rgb(${[
    getRandomIntInclusive(0, 200),
    getRandomIntInclusive(0, 200),
    getRandomIntInclusive(0, 200),
  ].join(",")})`
}

function getRandomArbitrary(min, max) {
  return Rune.deterministicRandom() * (max - min) + min
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Rune.deterministicRandom() * (max - min + 1) + min)
}
