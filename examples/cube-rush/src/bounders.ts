import * as THREE from "three"
import {
  LEFT_WALL_POSITION,
  RIGHT_WALL_POSITION,
  TRACK_DISTANCE,
  CUBE_COLORS,
} from "./config"
import finishLine from "./finishLine.png?url"

const WALL_WIDTH = 0.001
const WALL_HEIGHT = 0.6
const WALL_DEPTH = TRACK_DISTANCE * 2

export function createWall(position: "left" | "right", scene: THREE.Scene) {
  const geometry = new THREE.BoxGeometry(WALL_WIDTH, WALL_HEIGHT, WALL_DEPTH)
  const material = new THREE.MeshBasicMaterial({
    color: position === "left" ? CUBE_COLORS[0] : CUBE_COLORS[1],
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.x =
    position === "left" ? LEFT_WALL_POSITION : RIGHT_WALL_POSITION
  mesh.position.y = WALL_HEIGHT / 2
  mesh.position.z = -WALL_DEPTH / 2

  scene.add(mesh)
}
const FINISH_LINE_WIDTH = RIGHT_WALL_POSITION - LEFT_WALL_POSITION
const FINISH_LINE_HEIGHT = 0
const FINISH_LINE_DEPTH = 2

export function createFinishLine(scene: THREE.Scene) {
  const geometry = new THREE.BoxGeometry(
    FINISH_LINE_WIDTH,
    FINISH_LINE_HEIGHT,
    FINISH_LINE_DEPTH,
  )

  const texture = new THREE.TextureLoader().load(finishLine)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(FINISH_LINE_WIDTH * 10, 1)

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.x = 0
  mesh.position.y = 0
  mesh.position.z = -TRACK_DISTANCE

  scene.add(mesh)
}

export function createGroundPlane(scene: THREE.Scene) {
  const geometry = new THREE.PlaneGeometry(10, WALL_DEPTH)

  const material = new THREE.MeshStandardMaterial({ color: 0xc900f3 })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.x += -0.5 * Math.PI
  mesh.position.z += -TRACK_DISTANCE / 2
  mesh.position.y = -0.001

  scene.add(mesh)
}
