import * as THREE from "three"
import {
  CUBE_WIDTH,
  CUBE_HEIGHT,
  CUBE_DEPTH,
  CUBE_COLORS,
  NUMBER_OF_CUBES,
} from "./config"

const colors = CUBE_COLORS.map((color) => new THREE.Color(color))

//Using instanced mesh to reduce number of GPU calls
const mesh = new THREE.InstancedMesh(
  new THREE.BoxGeometry(CUBE_WIDTH, CUBE_HEIGHT, CUBE_DEPTH),
  new THREE.MeshBasicMaterial({ color: 0xffffff }),
  NUMBER_OF_CUBES,
)

//Used to generate matrix necessary to set the position of cubes
const objectForMatrix = new THREE.Object3D()

export function setCube(x: number, z: number, i: number, colorIdx: number) {
  objectForMatrix.position.y = CUBE_HEIGHT / 2
  objectForMatrix.position.x = x
  objectForMatrix.position.z = z
  objectForMatrix.updateMatrix()

  //Update the position/color of
  mesh.setMatrixAt(i, objectForMatrix.matrix)
  mesh.setColorAt(i, colors[colorIdx])
}

export function confirmUpdate() {
  //Necessary to inform GPU that one of the cubes color has changed
  if (mesh.instanceColor) {
    mesh.instanceColor.needsUpdate = true
  }
}

export function getInstancedMesh() {
  return mesh
}
