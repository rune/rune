class Brick {
  static _columns
  static _rows

  static createBricks(canvas, columns, rows, color) {
    this._columns = columns
    this._rows = rows

    const bricks = []

    for (let row = 0; row < this._rows; row++) {
      for (let column = 0; column < this._columns; column++) {
        bricks.push(new Brick(canvas, row, column, color))
      }
    }

    return new Set(bricks)
  }

  _height = 0.05
  _spacing = 0.05

  _canvas
  _row
  _column
  _color

  constructor(canvas, row, column, color) {
    this._canvas = canvas
    this._row = row
    this._column = column
    this._color = color
  }

  get spacing() {
    return this._canvas.width * this._spacing
  }

  get width() {
    return (
      (this._canvas.width - this.spacing * (Brick._columns + 1)) /
      Brick._columns
    )
  }

  get height() {
    return Math.min(this._canvas.height, this._canvas.width) * this._height
  }

  get x() {
    return this.width * this._column + this.spacing * (this._column + 1)
  }

  get y() {
    return this.height * this._row + (this.height / 2) * (this._row + 1)
  }

  render() {
    const ctx = this._canvas.ctx
    ctx.beginPath()
    roundRect(ctx, this.x, this.y, this.width, this.height, this.height / 2)
    ctx.fillStyle = this._color
    ctx.fill()
    ctx.closePath()
  }
}
