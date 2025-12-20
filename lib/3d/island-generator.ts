/**
 * Island Generator
 * Creates 3D island formations with unique elements per BODMAS category
 */

import * as THREE from 'three'

export type IslandType =
  | 'bodmas'
  | 'grid_method'
  | 'fractions'
  | 'decimals'
  | 'percentages'
  | 'algebra'

export interface IslandConfig {
  type: IslandType
  position?: { x: number; y: number; z: number }
  scale?: number
}

/**
 * Generate a 3D island based on type
 */
export function generateIsland(config: IslandConfig): THREE.Group {
  const islandGroup = new THREE.Group()

  // Base island shape (similar for all)
  const baseGeometry = new THREE.ConeGeometry(5, 2, 8)
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: getIslandColor(config.type),
    roughness: 0.7,
  })
  const base = new THREE.Mesh(baseGeometry, baseMaterial)
  base.position.y = 1
  base.castShadow = true
  base.receiveShadow = true
  islandGroup.add(base)

  // Add unique elements based on island type
  const uniqueElements = getUniqueElements(config.type)
  uniqueElements.forEach((element) => {
    islandGroup.add(element)
  })

  // Apply position and scale
  if (config.position) {
    islandGroup.position.set(config.position.x, config.position.y, config.position.z)
  }
  if (config.scale) {
    islandGroup.scale.set(config.scale, config.scale, config.scale)
  }

  return islandGroup
}

/**
 * Get island color based on type
 */
function getIslandColor(type: IslandType): number {
  const colors: Record<IslandType, number> = {
    bodmas: 0x4a90e2, // Blue
    grid_method: 0x50c878, // Green
    fractions: 0xff6b6b, // Red
    decimals: 0xffa500, // Orange
    percentages: 0x9370db, // Purple
    algebra: 0xff1493, // Pink
  }
  return colors[type] || 0x4a90e2
}

/**
 * Get unique elements for each island type
 */
function getUniqueElements(type: IslandType): THREE.Object3D[] {
  const elements: THREE.Object3D[] = []

  switch (type) {
    case 'bodmas':
      // Add mathematical symbols
      elements.push(createSymbol('+', 2, 3, 0))
      elements.push(createSymbol('×', -2, 3, 0))
      break
    case 'grid_method':
      // Add grid pattern
      elements.push(createGridPattern(0, 3, 0))
      break
    case 'fractions':
      // Add fraction symbols
      elements.push(createSymbol('½', 0, 3, 0))
      break
    case 'decimals':
      // Add decimal point
      elements.push(createSymbol('.', 0, 3, 0))
      break
    case 'percentages':
      // Add percentage symbol
      elements.push(createSymbol('%', 0, 3, 0))
      break
    case 'algebra':
      // Add variable symbols
      elements.push(createSymbol('x', 2, 3, 0))
      elements.push(createSymbol('y', -2, 3, 0))
      break
  }

  return elements
}

/**
 * Create a simple symbol representation (placeholder - would use proper 3D text in production)
 */
function createSymbol(symbol: string, x: number, y: number, z: number): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(1, 1, 0.1)
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(x, y, z)
  return mesh
}

/**
 * Create a grid pattern
 */
function createGridPattern(x: number, y: number, z: number): THREE.Group {
  const group = new THREE.Group()
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const geometry = new THREE.BoxGeometry(0.5, 0.1, 0.5)
      const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
      const cell = new THREE.Mesh(geometry, material)
      cell.position.set(x + i * 0.6 - 0.6, y, z + j * 0.6 - 0.6)
      group.add(cell)
    }
  }
  return group
}

