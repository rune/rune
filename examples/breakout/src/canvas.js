class Canvas {
  _canvas = document.getElementById("canvas")

  constructor() {
    this._canvas.style.backgroundColor = "white"
    window.addEventListener("resize", () => {
      this._autosize()
    })
    this._autosize()
  }

  _autosize() {
    this._canvas.width = window.innerWidth
    this._canvas.height = window.innerHeight
  }

  get width() {
    return this._canvas.width
  }

  get height() {
    return this._canvas.height
  }

  get ctx() {
    return this._canvas.getContext("2d")
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }
}
