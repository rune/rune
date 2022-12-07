class Game {
  static options

  _paused
  _canvas
  _paddle
  _bricks
  _ball

  score
  onGameOver

  constructor({ onGameOver }) {
    this.onGameOver = onGameOver

    this._listenToMoveEvents()
    this._reset()
    this._render()
  }

  _listenToMoveEvents() {
    document.addEventListener("mousemove", (e) => {
      if (this._paused) return
      this._paddle.updatePosition(e.clientX)
    })

    document.addEventListener("touchmove", (e) => {
      if (this._paused) return
      this._paddle.updatePosition(e.touches[0].clientX)
    })
  }

  _tick() {
    if (this._paused) return

    this._ball.move()

    if (
      this._ball.isTouchingRect(this._paddle) ||
      this._ball.isTouchingTopWall()
    ) {
      this._ball.revertMove()
      this._ball.reflectY()
      return
    }

    if (this._ball.isTouchingLeftWall() || this._ball.isTouchingRightWall()) {
      this._ball.revertMove()
      this._ball.reflectX()
      return
    }

    let brickWasHit = false

    for (const brick of this._bricks) {
      if (this._ball.isTouchingRect(brick)) {
        this.score += 1
        this._bricks.delete(brick)
        brickWasHit = true
      }
    }

    if (brickWasHit) {
      this._ball.revertMove()
      this._ball.reflectY()
      return
    }

    if (this._ball.isTouchingBottomWall() || this._bricks.size === 0) {
      this._paused = true
      this.onGameOver()
    }
  }

  _renderScore() {
    const text = `Score: ${this.score}`
    const fontSize = Math.min(this._canvas.width, this._canvas.height) / 10

    this._canvas.ctx.font = `${fontSize}px Arial`
    this._canvas.ctx.fillStyle = "#aaa"

    const { width } = this._canvas.ctx.measureText(text)

    this._canvas.ctx.fillText(
      text,
      this._canvas.width / 2 - width / 2,
      this._canvas.height / 2
    )
  }

  _render() {
    this._tick()

    this._canvas.clear()

    this._renderScore()
    this._paddle.render()
    this._ball.render()
    this._bricks.forEach((brick) => {
      brick.render()
    })

    requestAnimationFrame(() => {
      this._render()
    })
  }

  _reset() {
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
    } = Game.options

    this.pause()

    this.score = 0
    this._canvas = new Canvas()
    this._paddle = new Paddle(this._canvas, paddleColor, paddlePosition)
    this._ball = new Ball(this._canvas, ballColor, ballX, ballY, ballGoesRight)
    this._bricks = Brick.createBricks(
      this._canvas,
      brickColumns,
      brickRows,
      brickColor
    )
  }

  start() {
    this._paused = false
  }

  pause() {
    this._paused = true
  }

  restart() {
    this._reset()
    this.start()
  }
}
