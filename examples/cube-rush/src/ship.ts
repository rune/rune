import * as THREE from "three"
// eslint-disable-next-line
// @ts-ignore
import { Text } from "troika-three-text"
import oswald from "./style/Oswald.ttf?url"

import { SHIP_DEPTH, HALF_SHIP_WIDTH, SHIP_HEIGHT } from "./config"

export function createShip(scene: THREE.Scene, color: number) {
  const geometry = new THREE.BufferGeometry()
  const vertices = new Float32Array([
    // v0: front
    0.0,
    0.0,
    -SHIP_DEPTH + 0.02,
    // v1: left
    -HALF_SHIP_WIDTH,
    0.0,
    0.04,
    // v2: right
    HALF_SHIP_WIDTH,
    0.0,
    0.04,
    // v3: top
    0.0,
    SHIP_HEIGHT,
    0.04,
  ])
  geometry.setIndex([3, 0, 1, 1, 2, 3, 2, 0, 3]) // faces
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3))

  const material = new THREE.MeshBasicMaterial({
    color,
  })

  const ship = new THREE.Mesh(geometry, material)
  ship.position.y = 0.02

  scene.add(ship)

  return ship
}

export function createShipLabel(
  scene: THREE.Scene,
  displayName: string,
  avatarUrl: string
) {
  // Display Name
  const displayNameObj = new Text()
  const text =
    displayName.length < 10 ? displayName : `${displayName.slice(0, 7)}...`

  displayNameObj.text = text
  displayNameObj.fontSize = 0.025
  displayNameObj.font = oswald
  displayNameObj.position.x = 0
  displayNameObj.position.y = -1
  displayNameObj.position.z = 0.05
  displayNameObj.anchorX = "center"
  displayNameObj.anchorY = "middle"
  displayNameObj.color = "white"
  displayNameObj.sync()

  scene.add(displayNameObj)

  // Avatar
  const geometry = new THREE.BoxGeometry(0.03, 0.03, 0)

  const texture = new THREE.TextureLoader().load(avatarUrl)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(1, 1)

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
  })
  const avatarObj = new THREE.Mesh(geometry, material)
  avatarObj.position.x = 0
  avatarObj.position.y = -1
  avatarObj.position.z = 0.05

  scene.add(avatarObj)

  return { displayNameObj, avatarObj }
}
