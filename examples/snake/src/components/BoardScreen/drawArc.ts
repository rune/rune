export function drawArc(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  counterclockwise: boolean,
  color: string,
) {
  ctx.beginPath()
  ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise)

  ctx.lineWidth = 2 * window.devicePixelRatio
  ctx.strokeStyle = color
  ctx.shadowBlur = 10 * window.devicePixelRatio
  ctx.shadowColor = color

  ctx.stroke()
  ctx.stroke()
}
