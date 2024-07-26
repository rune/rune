//https://stackoverflow.com/a/10511598
export function fittingString(
  c: CanvasRenderingContext2D,
  str: string,
  maxWidth: number
) {
  let width = c.measureText(str).width
  const ellipsis = "…"
  const ellipsisWidth = c.measureText(ellipsis).width
  if (width <= maxWidth || width <= ellipsisWidth) {
    return str
  } else {
    let len = str.length
    while (width >= maxWidth - ellipsisWidth && len-- > 0) {
      str = str.substring(0, len)
      width = c.measureText(str).width
    }
    return str + ellipsis
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const throttle = (fn: (...args: any[]) => void, wait = 300) => {
  let inThrottle: boolean,
    lastFn: ReturnType<typeof setTimeout>,
    lastTime: number
  return function (...args: unknown[]) {
    if (!inThrottle) {
      // eslint-disable-next-line prefer-spread
      fn.apply(null, args)
      lastTime = Date.now()
      inThrottle = true
    } else {
      clearTimeout(lastFn)
      lastFn = setTimeout(
        () => {
          if (Date.now() - lastTime >= wait) {
            // eslint-disable-next-line prefer-spread
            fn.apply(null, args)
            lastTime = Date.now()
          }
        },
        Math.max(wait - (Date.now() - lastTime), 0)
      )
    }
  }
}
