export function animate(
  delay: number,
  duration: number,
  onUpdate: (value: number) => void
) {
  let handle = requestAnimationFrame(tick)
  const start = Date.now() + delay

  function tick() {
    if (Date.now() < start) {
      handle = requestAnimationFrame(tick)
      return
    }

    const newValue = Math.min(1, (Date.now() - start) / duration)

    onUpdate(newValue)

    if (newValue < 1) handle = requestAnimationFrame(tick)
  }

  return () => cancelAnimationFrame(handle)
}
