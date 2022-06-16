class Paddle {
  #width = 0.25
  #height = 0.05

  #canvas
  #color
  #position

  constructor(canvas, color, position) {
    this.#canvas = canvas
    this.#color = color
    this.#position = position
  }

  get width() {
    return this.#canvas.width * this.#width
  }

  get height() {
    return Math.min(this.#canvas.height, this.#canvas.width) * this.#height
  }

  get x() {
    const x = this.#canvas.width * this.#position - this.width / 2

    return x < 0
      ? 0
      : x + this.width > this.#canvas.width
      ? this.#canvas.width - this.width
      : x
  }

  get y() {
    return this.#canvas.height - 2 * this.height
  }

  updatePosition(x) {
    this.#position = x / this.#canvas.width
  }

  render() {
    const ctx = this.#canvas.ctx
    roundRect(ctx, this.x, this.y, this.width, this.height, this.height / 2)
    ctx.fillStyle = this.#color
    ctx.fill()
    ctx.closePath()
  }
}
