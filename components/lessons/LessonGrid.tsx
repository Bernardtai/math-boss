'use client'

import { useState } from 'react'
import { LessonIsland } from './LessonIsland'
import { Island3DView } from './Island3DView'
import type { IslandType } from '@/lib/3d/island-generator'

interface Lesson {
  id: string
  name: string
  description: string
  icon: string
  colorTheme: string
  levelCount: number
  bossCount: number
  completedLevels: number
  isUnlocked: boolean
}

// Mock data based on PRP_02 Lesson System
const lessons: Lesson[] = [
  {
    id: 'bodmas',
    name: 'BODMAS',
    description: 'Order of operations',
    icon: 'B',
    colorTheme: 'bodmas',
    levelCount: 7,
    bossCount: 2,
    completedLevels: 0,
    isUnlocked: true, // First island always unlocked
  },
  {
    id: 'grid_method',
    name: 'Grid Method',
    description: 'Fast multiplication',
    icon: '⊞',
    colorTheme: 'grid_method',
    levelCount: 3,
    bossCount: 1,
    completedLevels: 0,
    isUnlocked: false,
  },
  {
    id: 'fractions',
    name: 'Fractions',
    description: 'Mixed operations',
    icon: '⅓',
    colorTheme: 'fractions',
    levelCount: 8,
    bossCount: 1,
    completedLevels: 0,
    isUnlocked: false,
  },
  {
    id: 'decimals',
    name: 'Decimals',
    description: 'All four operations',
    icon: '0.',
    colorTheme: 'decimals',
    levelCount: 6,
    bossCount: 1,
    completedLevels: 0,
    isUnlocked: false,
  },
  {
    id: 'percentages',
    name: 'Percentages',
    description: 'Percentage calculations',
    icon: '%',
    colorTheme: 'percentages',
    levelCount: 6,
    bossCount: 1,
    completedLevels: 0,
    isUnlocked: false,
  },
  {
    id: 'algebra',
    name: 'Algebra',
    description: 'Basic expressions',
    icon: 'x',
    colorTheme: 'algebra',
    levelCount: 6,
    bossCount: 1,
    completedLevels: 0,
    isUnlocked: false,
  },
]

interface LessonGridProps {
  onIslandClick?: (lessonId: string) => void
}

const lessonIdToIslandType = (lessonId: string): IslandType => {
  const mapping: Record<string, IslandType> = {
    bodmas: 'bodmas',
    grid_method: 'grid_method',
    fractions: 'fractions',
    decimals: 'decimals',
    percentages: 'percentages',
    algebra: 'algebra',
  }
  return mapping[lessonId] || 'bodmas'
}

export function LessonGrid({ onIslandClick }: LessonGridProps) {
  const [selectedIsland, setSelectedIsland] = useState<{ id: string; name: string; type: IslandType } | null>(null)

  const handleIslandClick = (lessonId: string) => {
    if (onIslandClick) {
      onIslandClick(lessonId)
    } else {
      // Default behavior - navigate to lesson page
      console.log(`Navigate to lesson: ${lessonId}`)
      // TODO: Implement navigation to lesson page
    }
  }

  const handleView3D = (lessonId: string, lessonName: string) => {
    setSelectedIsland({
      id: lessonId,
      name: lessonName,
      type: lessonIdToIslandType(lessonId),
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Math Boss Islands!
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Embark on your mathematical journey across these islands. Master each topic
          and defeat the boss levels to unlock new adventures!
        </p>
      </div>

      {/* Island Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="relative group">
            <LessonIsland
              {...lesson}
              onClick={() => handleIslandClick(lesson.id)}
            />
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleView3D(lesson.id, lesson.name)
              }}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium hover:bg-primary/90"
            >
              3D View
            </button>
          </div>
        ))}
      </div>

      {/* 3D Island View Modal */}
      {selectedIsland && (
        <Island3DView
          islandType={selectedIsland.type}
          islandName={selectedIsland.name}
          onClose={() => setSelectedIsland(null)}
        />
      )}

      {/* Progress Summary */}
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Your Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {lessons.filter(lesson => lesson.completedLevels === lesson.levelCount + lesson.bossCount).length}
            </div>
            <div className="text-sm text-gray-600">Islands Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {lessons.reduce((total, lesson) => total + Math.min(lesson.completedLevels, lesson.levelCount), 0)}
            </div>
            <div className="text-sm text-gray-600">Levels Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {lessons.reduce((total, lesson) => {
                const bossLevels = lesson.completedLevels - lesson.levelCount
                return total + Math.max(0, bossLevels)
              }, 0)}
            </div>
            <div className="text-sm text-gray-600">Bosses Defeated</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(
                (lessons.reduce((total, lesson) => total + lesson.completedLevels, 0) /
                lessons.reduce((total, lesson) => total + lesson.levelCount + lesson.bossCount, 0)) * 100
              )}%
            </div>
            <div className="text-sm text-gray-600">Overall Progress</div>
          </div>
        </div>
      </div>
    </div>
  )
}
