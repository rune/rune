export function animate(
  delay: number,
  duration: number,
  onUpdate: (value: number) => void
) {
  const timeoutHandle = setTimeout(tick, delay)
  let animateHandle: number
  const start = Date.now() + delay

  function tick() {
    const newValue = Math.min(1, (Date.now() - start) / duration)

    onUpdate(newValue)

    if (newValue < 1) animateHandle = requestAnimationFrame(tick)
  }

  return () => {
    clearTimeout(timeoutHandle)
    cancelAnimationFrame(animateHandle)
  }
}
