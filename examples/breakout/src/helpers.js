function roundRect(ctx, x, y, width, height, radius) {
  if (width < 2 * radius) radius = width / 2
  if (height < 2 * radius) radius = height / 2
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + width, y, x + width, y + height, radius)
  ctx.arcTo(x + width, y + height, x, y + height, radius)
  ctx.arcTo(x, y + height, x, y, radius)
  ctx.arcTo(x, y, x + width, y, radius)
}
