/**
 * Three.js Scene Setup
 * Basic scene configuration for 3D island visualization
 */

import * as THREE from 'three'

export interface SceneConfig {
  width: number
  height: number
  backgroundColor?: number
  fogColor?: number
  fogNear?: number
  fogFar?: number
}

/**
 * Create a basic Three.js scene
 */
export function createScene(config: SceneConfig): {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
} {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(config.backgroundColor || 0x87ceeb) // Sky blue
  scene.fog = new THREE.Fog(
    config.fogColor || 0x87ceeb,
    config.fogNear || 10,
    config.fogFar || 1000
  )

  const camera = new THREE.PerspectiveCamera(
    75,
    config.width / config.height,
    0.1,
    1000
  )
  camera.position.set(0, 10, 20)
  camera.lookAt(0, 0, 0)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(config.width, config.height)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  // Add directional light (sun)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(10, 20, 10)
  directionalLight.castShadow = true
  scene.add(directionalLight)

  return { scene, camera, renderer }
}

/**
 * Add basic ground plane
 */
export function addGround(scene: THREE.Scene, size: number = 100): THREE.Mesh {
  const groundGeometry = new THREE.PlaneGeometry(size, size)
  const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x90ee90 })
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = 0
  ground.receiveShadow = true
  scene.add(ground)
  return ground
}

