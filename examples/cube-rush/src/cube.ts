import * as THREE from "three"
import { CUBE_WIDTH, CUBE_HEIGHT, CUBE_DEPTH, CUBE_COLORS } from "./config"

const geometry = new THREE.BoxGeometry(CUBE_WIDTH, CUBE_HEIGHT, CUBE_DEPTH)
const meshMaterials = [
  new THREE.MeshBasicMaterial({ color: CUBE_COLORS[0] }),
  new THREE.MeshBasicMaterial({ color: CUBE_COLORS[1] }),
]

export function createCube(scene: THREE.Scene, colorIdx: number) {
  const material = meshMaterials[colorIdx]

  // Mesh
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.x = 0
  mesh.position.y = -1
  mesh.position.z = 0

  // Add to scene
  scene.add(mesh)

  return {
    set(x: number, z: number, colorIdx: number) {
      mesh.position.y = CUBE_HEIGHT / 2
      mesh.position.x = x
      mesh.position.z = z
      mesh.material = meshMaterials[colorIdx]
    },
  }
}
