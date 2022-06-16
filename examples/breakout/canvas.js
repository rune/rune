class Canvas {
  #canvas = document.getElementById("canvas")

  constructor() {
    this.#canvas.style.backgroundColor = "white"
    window.addEventListener("resize", () => this.#autosize())
    this.#autosize()
  }

  #autosize() {
    this.#canvas.width = window.innerWidth
    this.#canvas.height = window.innerHeight
  }

  get width() {
    return this.#canvas.width
  }

  get height() {
    return this.#canvas.height
  }

  get ctx() {
    return this.#canvas.getContext("2d")
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }
}
