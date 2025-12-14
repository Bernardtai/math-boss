import { Level, UserProgress, UserUnlock } from '@/lib/db/queries'

/**
 * Check if a level is unlocked for a user
 */
export function isLevelUnlocked(
  level: Level,
  userProgress: UserProgress[],
  userUnlocks: UserUnlock[],
  allLevels: Level[]
): boolean {
  // First level of first lesson is always unlocked
  if (level.order_index === 1) {
    const firstLesson = allLevels.find((l) => l.order_index === 1)
    if (firstLesson && level.id === firstLesson.id) {
      return true
    }
  }

  // Check if explicitly unlocked
  const isExplicitlyUnlocked = userUnlocks.some((unlock) => unlock.level_id === level.id)
  if (isExplicitlyUnlocked) {
    return true
  }

  // Check unlock requirements
  if (level.unlock_requirements) {
    const requirements = level.unlock_requirements as {
      required_levels?: string[]
      min_score?: number
    }

    // Check required levels
    if (requirements.required_levels) {
      for (const requiredLevelId of requirements.required_levels) {
        const requiredProgress = userProgress.find((p) => p.level_id === requiredLevelId)
        if (!requiredProgress || !requiredProgress.passed) {
          return false
        }
      }
    }

    // Check minimum score (if specified)
    if (requirements.min_score) {
      const lessonLevels = allLevels.filter((l) => l.lesson_id === level.lesson_id)
      const totalScore = userProgress
        .filter((p) => lessonLevels.some((l) => l.id === p.level_id))
        .reduce((sum, p) => sum + p.score, 0)
      
      if (totalScore < requirements.min_score) {
        return false
      }
    }
  } else {
    // If no requirements, check if previous level is completed
    const previousLevel = allLevels.find(
      (l) => l.lesson_id === level.lesson_id && l.order_index === level.order_index - 1
    )
    
    if (previousLevel) {
      const previousProgress = userProgress.find((p) => p.level_id === previousLevel.id)
      return previousProgress?.passed ?? false
    }
  }

  return false
}

/**
 * Get the next level to unlock after completing a level
 */
export function getNextLevel(
  completedLevelId: string,
  allLevels: Level[]
): Level | null {
  const completedLevel = allLevels.find((l) => l.id === completedLevelId)
  if (!completedLevel) {
    return null
  }

  // Find next level in same lesson
  const nextLevel = allLevels.find(
    (l) => l.lesson_id === completedLevel.lesson_id && l.order_index === completedLevel.order_index + 1
  )

  return nextLevel || null
}

/**
 * Check if user can access a level (unlocked and not locked by prerequisites)
 */
export function canAccessLevel(
  level: Level,
  userProgress: UserProgress[],
  userUnlocks: UserUnlock[],
  allLevels: Level[]
): boolean {
  return isLevelUnlocked(level, userProgress, userUnlocks, allLevels)
}

