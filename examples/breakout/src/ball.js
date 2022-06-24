class Ball {
  _radius = 0.04
  _dx = -0.01
  _dy = -0.01

  _canvas
  _color
  _x
  _y

  constructor(canvas, color, x, y, goesRight) {
    this._canvas = canvas
    this._color = color
    this._x = x
    this._y = y
    if (goesRight) this._dx *= -1
  }

  get radius() {
    return Math.min(this._canvas.height, this._canvas.width) * this._radius
  }

  get x() {
    return this._canvas.width * this._x
  }

  get y() {
    return this._canvas.height * this._y
  }

  reflectX() {
    this._dx = -this._dx
  }

  reflectY() {
    this._dy = -this._dy
  }

  move() {
    this._x += this._dx
    this._y += this._dy
  }

  revertMove() {
    this._x -= this._dx
    this._y -= this._dy
  }

  isTouchingLeftWall() {
    return this.x - this.radius <= 0
  }

  isTouchingTopWall() {
    return this.y - this.radius <= 0
  }

  isTouchingRightWall() {
    return this.x + this.radius >= this._canvas.width
  }

  isTouchingBottomWall() {
    return this.y + this.radius >= this._canvas.height
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
    const ctx = this._canvas.ctx
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = this._color
    ctx.fill()
    ctx.closePath()
  }
}
