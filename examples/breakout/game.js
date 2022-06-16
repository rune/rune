class Game {
  #options
  #paused
  #canvas
  #paddle
  #bricks
  #ball

  score
  onGameOver

  constructor({ onGameOver, ...options }) {
    this.#options = options
    this.onGameOver = onGameOver

    this.#listenToMoveEvents()
    this.#reset()
    this.#render()
  }

  #listenToMoveEvents() {
    document.addEventListener("mousemove", (e) => {
      if (this.#paused) return
      this.#paddle.updatePosition(e.clientX)
    })

    document.addEventListener("touchmove", (e) => {
      if (this.#paused) return
      this.#paddle.updatePosition(e.touches[0].clientX)
    })
  }

  #tick() {
    if (this.#paused) return

    this.#ball.move()

    if (
      this.#ball.isTouchingRect(this.#paddle) ||
      this.#ball.isTouchingTopWall()
    ) {
      this.#ball.revertMove()
      this.#ball.reflectY()
      return
    }

    if (this.#ball.isTouchingLeftWall() || this.#ball.isTouchingRightWall()) {
      this.#ball.revertMove()
      this.#ball.reflectX()
      return
    }

    let brickWasHit = false

    for (const brick of this.#bricks) {
      if (this.#ball.isTouchingRect(brick)) {
        this.score += 1
        this.#bricks.delete(brick)
        brickWasHit = true
      }
    }

    if (brickWasHit) {
      this.#ball.revertMove()
      this.#ball.reflectY()
      return
    }

    if (this.#ball.isTouchingBottomWall() || this.#bricks.size === 0) {
      this.#paused = true
      this.onGameOver()
    }
  }

  #renderScore() {
    const text = `Score: ${this.score}`
    const fontSize = Math.min(this.#canvas.width, this.#canvas.height) / 10

    this.#canvas.ctx.font = `${fontSize}px Arial`
    this.#canvas.ctx.fillStyle = "#aaa"

    const { width } = this.#canvas.ctx.measureText(text)

    this.#canvas.ctx.fillText(
      text,
      this.#canvas.width / 2 - width / 2,
      this.#canvas.height / 2
    )
  }

  #render() {
    this.#tick()

    this.#canvas.clear()

    this.#renderScore()
    this.#paddle.render()
    this.#ball.render()
    this.#bricks.forEach((brick) => brick.render())

    requestAnimationFrame(() => this.#render())
  }

  #reset() {
    const {
      paddleColor,
      paddlePosition,
      ballColor,
      ballX,
      ballY,
      ballGoesRight,
      brickColumns,
      brickRows,
      brickColor,
    } = this.#options

    this.pause()

    this.score = 0
    this.#canvas = new Canvas()
    this.#paddle = new Paddle(this.#canvas, paddleColor, paddlePosition)
    this.#ball = new Ball(this.#canvas, ballColor, ballX, ballY, ballGoesRight)
    this.#bricks = Brick.createBricks(
      this.#canvas,
      brickColumns,
      brickRows,
      brickColor
    )
  }

  start() {
    this.#paused = false
  }

  pause() {
    this.#paused = true
  }

  restart() {
    this.#reset()
    this.start()
  }
}
