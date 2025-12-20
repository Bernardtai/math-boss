/**
 * Type definitions for profile-related data
 */

import type { AvatarCustomization } from '@/lib/db/types'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  country: string | null
  date_of_birth: string | null
  avatar_url: string | null
  age: number | null
  avatar_customization: AvatarCustomization | null
  created_at: string
  updated_at: string
}

export interface UserStats {
  lessonsCompleted: number
  bestScore: number
  timeStudied: number // in minutes
  currentStreak: number
  totalPoints: number
}

export interface IslandProgress {
  lessonId: string
  lessonName: string
  completedLevels: number
  totalLevels: number
  progress: number // percentage
}

export interface UserAchievement {
  id: string
  achievement_id: string
  name?: string
  description?: string
  icon_url?: string
  earned_at: string
  progress_value: number
}

