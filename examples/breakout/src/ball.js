class Ball {
  #radius = 0.04
  #dx = -0.01
  #dy = -0.01

  #canvas
  #color
  #x
  #y

  constructor(canvas, color, x, y, goesRight) {
    this.#canvas = canvas
    this.#color = color
    this.#x = x
    this.#y = y
    if (goesRight) this.#dx *= -1
  }

  get radius() {
    return Math.min(this.#canvas.height, this.#canvas.width) * this.#radius
  }

  get x() {
    return this.#canvas.width * this.#x
  }

  get y() {
    return this.#canvas.height * this.#y
  }

  reflectX() {
    this.#dx = -this.#dx
  }

  reflectY() {
    this.#dy = -this.#dy
  }

  move() {
    this.#x += this.#dx
    this.#y += this.#dy
  }

  revertMove() {
    this.#x -= this.#dx
    this.#y -= this.#dy
  }

  isTouchingLeftWall() {
    return this.x - this.radius <= 0
  }

  isTouchingTopWall() {
    return this.y - this.radius <= 0
  }

  isTouchingRightWall() {
    return this.x + this.radius >= this.#canvas.width
  }

  isTouchingBottomWall() {
    return this.y + this.radius >= this.#canvas.height
  }

  isTouchingRect(rect) {
    return (
      this.x + this.radius >= rect.x &&
      this.x - this.radius <= rect.x + rect.width &&
      this.y + this.radius >= rect.y &&
      this.y - this.radius <= rect.y + rect.height
    )
  }

  render() {
    const ctx = this.#canvas.ctx
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = this.#color
    ctx.fill()
    ctx.closePath()
  }
}
