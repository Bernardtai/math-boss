'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { createScene, addGround } from '@/lib/3d/scene-setup'
import { generateIsland, IslandType } from '@/lib/3d/island-generator'

interface Island3DProps {
  islandType: IslandType
  width?: number
  height?: number
  className?: string
}

export function Island3D({
  islandType,
  width = 400,
  height = 400,
  className,
}: Island3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    island: THREE.Group
    animationId: number
  } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Create scene
    const { scene, camera, renderer } = createScene({ width, height })
    addGround(scene)

    // Generate island
    const island = generateIsland({ type: islandType })
    scene.add(island)

    // Add to container
    containerRef.current.appendChild(renderer.domElement)

    // Animation loop
    const animate = () => {
      const id = requestAnimationFrame(animate)
      
      // Rotate island slowly
      island.rotation.y += 0.005

      renderer.render(scene, camera)
      
      if (sceneRef.current) {
        sceneRef.current.animationId = id
      }
    }
    animate()

    sceneRef.current = { scene, camera, renderer, island, animationId: 0 }

    // Cleanup
    return () => {
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId)
        sceneRef.current.renderer.dispose()
        if (containerRef.current && containerRef.current.contains(sceneRef.current.renderer.domElement)) {
          containerRef.current.removeChild(sceneRef.current.renderer.domElement)
        }
      }
    }
  }, [islandType, width, height])

  return <div ref={containerRef} className={className} />
}

