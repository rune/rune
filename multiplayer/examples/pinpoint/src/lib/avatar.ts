// Source: https://github.com/rune/tango/blob/staging/db_dump/master_data/avatar_item.json
const avatarItemsBase = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const avatarItemsHair = [
  19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
  38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54,
]
const avatarItemsHeadgear = [55, 56, 57, 58, 59, 60, 61, 76, 77, 78, 79, 80, 81]
const avatarItemsAccessory = [
  62, 63, 64, 65, 66, 67, 68, 82, 83, 84, 85, 86, 87, 88,
]
const avatarItemsBackground = [
  69, 70, 71, 72, 73, 74, 75, 89, 90, 91, 92, 93, 94, 95, 96, 97,
]
const avatarItemsExpression = [13, 14, 15, 16, 17, 18]

const pickRandom = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]

export const generateAvatarUrl = () => {
  // The order of these params is important for caching, should mirror this file:
  // https://github.com/rune/tango/blob/staging/src/lib/avatar.ts
  const params = Object.entries({
    base: pickRandom(avatarItemsBase),
    hair: pickRandom(avatarItemsHair),
    tilt: pickRandom([-1, 0, 1]),
    headgear: pickRandom(avatarItemsHeadgear),
    accessory: pickRandom(avatarItemsAccessory),
    background: pickRandom(avatarItemsBackground),
    expression: pickRandom(avatarItemsExpression),
    size: 420,
    isCropped: 1,
    isBackgroundTransparent: 0,
  })
    .map(([key, value]) => `${key}=${value}`)
    .join("&")

  return `https://app.rune.ai/avatar?${params}`
}
