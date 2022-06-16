class Brick {
  static #columns
  static #rows

  static createBricks(canvas, columns, rows, color) {
    this.#columns = columns
    this.#rows = rows

    const bricks = []

    for (let row = 0; row < this.#rows; row++) {
      for (let column = 0; column < this.#columns; column++) {
        bricks.push(new Brick(canvas, row, column, color))
      }
    }

    return new Set(bricks)
  }

  #height = 0.05
  #spacing = 0.05

  #canvas
  #row
  #column
  #color

  constructor(canvas, row, column, color) {
    this.#canvas = canvas
    this.#row = row
    this.#column = column
    this.#color = color
  }

  get spacing() {
    return this.#canvas.width * this.#spacing
  }

  get width() {
    return (
      (this.#canvas.width - this.spacing * (Brick.#columns + 1)) /
      Brick.#columns
    )
  }

  get height() {
    return Math.min(this.#canvas.height, this.#canvas.width) * this.#height
  }

  get x() {
    return this.width * this.#column + this.spacing * (this.#column + 1)
  }

  get y() {
    return this.height * this.#row + (this.height / 2) * (this.#row + 1)
  }

  render() {
    const ctx = this.#canvas.ctx
    ctx.beginPath()
    roundRect(ctx, this.x, this.y, this.width, this.height, this.height / 2)
    ctx.fillStyle = this.#color
    ctx.fill()
    ctx.closePath()
  }
}
