export const UPDATES_PER_SECOND = 30

export const AVATAR_WIDTH = 0.8

export const LEFT_WALL_POSITION = -1.5
export const RIGHT_WALL_POSITION = 1.5

export const HALF_SHIP_WIDTH = 0.03
export const SHIP_HEIGHT = 0.02
export const SHIP_DEPTH = 0.25
export const SHIP_START_POSITIONS = [
  [0],
  [-0.04, 0.04],
  [-0.08, 0, 0.08],
  [-0.12, -0.04, 0.04, 0.12],
  [-0.16, -0.08, 0, 0.08, 0.16],
  [-0.2, -0.12, -0.04, 0.04, 0.12, 0.2],
]
export const SHIP_COLORS = [
  0x00eaa9, 0x79a2ff, 0xf59a00, 0x467eff, 0xfff846, 0x18f1ff,
]
export const SHIP_X_SPEED_RATE = (1 / UPDATES_PER_SECOND) * 4
export const SHIP_Z_SPEED_RATE = (1 / UPDATES_PER_SECOND) * 0.06
export const SHIP_INIT_SPEED = 50
export const SHIP_MIN_SPEED = 50
export const SHIP_MAX_SPEED = 800

export const CUBE_WIDTH = 0.3
export const CUBE_HEIGHT = 0.35
export const CUBE_DEPTH = SHIP_Z_SPEED_RATE * SHIP_MAX_SPEED // Make sure ship does not pass through even on max speed
export const CUBE_COLORS = [0xf00044, 0x9c05fa] // L is 5% darker

export const TRACK_DISTANCE = 1000
export const NUMBER_OF_CUBES = TRACK_DISTANCE * 0.4
export const COUNTDOWN_MS = 5000
export const COMPLETED_PLAYER_START_SPECTATING_MS = 3000

export const BLINK_DURATION = 150
