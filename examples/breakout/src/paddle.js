class Paddle {
  _width = 0.25
  _height = 0.05

  _canvas
  _color
  _position

  constructor(canvas, color, position) {
    this._canvas = canvas
    this._color = color
    this._position = position
  }

  get width() {
    return this._canvas.width * this._width
  }

  get height() {
    return Math.min(this._canvas.height, this._canvas.width) * this._height
  }

  get x() {
    const x = this._canvas.width * this._position - this.width / 2

    return x < 0
      ? 0
      : x + this.width > this._canvas.width
      ? this._canvas.width - this.width
      : x
  }

  get y() {
    return this._canvas.height - 2 * this.height
  }

  updatePosition(x) {
    this._position = x / this._canvas.width
  }

  render() {
    const ctx = this._canvas.ctx
    roundRect(ctx, this.x, this.y, this.width, this.height, this.height / 2)
    ctx.fillStyle = this._color
    ctx.fill()
    ctx.closePath()
  }
}
