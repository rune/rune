export const countdownDuration = 5

export const endOfRoundDuration = 30000

export const maxScore = 10

export const boardSize = { width: 600, height: 900 }

export const forwardSpeedPixelsPerTick = 3

export const turningSpeedDegreesPerTick = 3

export const arcRadius =
  (180 * forwardSpeedPixelsPerTick) / (Math.PI * turningSpeedDegreesPerTick)

export const gapFrequency = 0.01

export const gapPlacementDurationTicks = 20

export const minTicksToNextGap = 30

export const colors = ["#BCFE00", "#10D4FF", "#FF32D2", "#FF9C27"]

export const collisionGridSize = Math.round(forwardSpeedPixelsPerTick * 1.5)
