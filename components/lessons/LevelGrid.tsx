'use client'

import { Level, UserProgress, UserUnlock } from '@/lib/db/types'
import { LevelCard } from './LevelCard'
import { isLevelUnlocked } from '@/lib/lessons/unlock-logic'
import { getIslandTheme } from '@/lib/lessons/island-themes'

interface LevelGridProps {
  levels: Level[]
  userProgress: UserProgress[]
  userUnlocks: UserUnlock[]
  lessonId: string
}

export function LevelGrid({ levels, userProgress, userUnlocks, lessonId }: LevelGridProps) {
  const sortedLevels = [...levels].sort((a, b) => a.order_index - b.order_index)
  const theme = getIslandTheme(lessonId)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Levels</h2>
        <p className="text-muted-foreground">
          Complete levels to unlock new challenges. Boss levels are extra challenging!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedLevels.map((level) => {
          const isUnlocked = isLevelUnlocked(level, userProgress, userUnlocks, levels)
          const progress = userProgress.find((p) => p.level_id === level.id)
          const isBossLevel = level.level_type.startsWith('boss')

          return (
            <LevelCard
              key={level.id}
              level={level}
              isUnlocked={isUnlocked}
              userProgress={progress}
              isBossLevel={isBossLevel}
              theme={theme}
            />
          )
        })}
      </div>
    </div>
  )
}

