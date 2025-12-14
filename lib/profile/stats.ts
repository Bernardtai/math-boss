/**
 * Statistics calculation utilities
 * Handles fetching and calculating user statistics from the database
 */

import { createClient } from '@/lib/supabase/client'
import type { UserStats, IslandProgress, UserAchievement } from './types'

/**
 * Get comprehensive user statistics
 */
export async function getUserStats(userId: string): Promise<UserStats> {
  const supabase = createClient()

  // Get all user progress records
  const { data: progressData, error: progressError } = await supabase
    .from('user_progress')
    .select('level_id, score, time_taken')
    .eq('user_id', userId)

  if (progressError) {
    console.error('Error fetching progress:', progressError)
  }

  // Get lessons completed count (distinct level_ids)
  const uniqueLevelIds = new Set(progressData?.map((p) => p.level_id) || [])
  const lessonsCompleted = uniqueLevelIds.size

  // Get best score
  const bestScore = progressData?.reduce((max, record) => {
    return Math.max(max, record.score || 0)
  }, 0) || 0

  // Get total time studied (sum of time_taken in seconds)
  const totalTimeSeconds = progressData?.reduce((sum, record) => sum + (record.time_taken || 0), 0) || 0
  const totalTimeMinutes = Math.floor(totalTimeSeconds / 60)

  // Get current streak
  const { data: streakData } = await supabase
    .from('learning_streaks')
    .select('current_streak')
    .eq('user_id', userId)
    .single()

  // Calculate total points (sum of all scores)
  const totalPoints = progressData?.reduce((sum, record) => sum + (record.score || 0), 0) || 0

  return {
    lessonsCompleted,
    bestScore,
    timeStudied: totalTimeMinutes,
    currentStreak: streakData?.current_streak || 0,
    totalPoints,
  }
}

/**
 * Get progress for each island/lesson
 */
export async function getIslandProgress(userId: string): Promise<IslandProgress[]> {
  const supabase = createClient()

  // Get all lessons
  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('id, name')
    .order('order_index')

  if (lessonsError || !lessons) {
    console.error('Error fetching lessons:', lessonsError)
    return []
  }

  // Get total levels for each lesson
  const { data: levelsData, error: levelsError } = await supabase
    .from('levels')
    .select('id, lesson_id')

  if (levelsError || !levelsData) {
    console.error('Error fetching levels:', levelsError)
    return []
  }

  // Get completed levels for user
  const { data: progressData, error: progressError } = await supabase
    .from('user_progress')
    .select('level_id')
    .eq('user_id', userId)

  if (progressError) {
    console.error('Error fetching progress:', progressError)
  }

  const completedLevelIds = new Set(progressData?.map((p) => p.level_id) || [])

  // Calculate progress for each lesson
  const islandProgress: IslandProgress[] = lessons.map((lesson) => {
    const lessonLevels = levelsData.filter((level) => level.lesson_id === lesson.id)
    const completedLevels = lessonLevels.filter((level) => completedLevelIds.has(level.id)).length
    const totalLevels = lessonLevels.length

    return {
      lessonId: lesson.id,
      lessonName: lesson.name,
      completedLevels,
      totalLevels,
      progress: totalLevels > 0 ? (completedLevels / totalLevels) * 100 : 0,
    }
  })

  return islandProgress
}

/**
 * Get user achievements
 */
export async function getUserAchievements(userId: string): Promise<UserAchievement[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false })

  if (error) {
    console.error('Error fetching achievements:', error)
    return []
  }

  return (data || []) as UserAchievement[]
}

