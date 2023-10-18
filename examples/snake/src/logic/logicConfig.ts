export const countdownDuration = 5

export const endOfRoundDuration = 3

export const maxScore = 10

export const boardSize = { width: 600, height: 900 }

export const speed = 1 / 3

export const forwardSpeedPixelsPerTick = 3 / speed

export const turningSpeedDegreesPerTick = 3 / speed

export const arcRadius =
  (180 * forwardSpeedPixelsPerTick) / (Math.PI * turningSpeedDegreesPerTick)

export const gapFrequency = 0.01 / speed

export const gapPlacementDurationTicks = 20 * speed

export const minTicksToNextGap = 30 * speed

export const colors = ["#BCFE00", "#10D4FF", "#FF32D2", "#FF9C27"]

export const pixelsPerCollisionGridSquare = Math.round(
  forwardSpeedPixelsPerTick * 1.5,
) // TODO: could be 1:1 if we fix serialization issue?
