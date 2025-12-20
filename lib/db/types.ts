// Database types
export interface Lesson {
  id: string
  name: string
  description: string | null
  icon_url: string | null
  color_theme: string | null
  order_index: number
}

export interface Level {
  id: string
  lesson_id: string
  name: string
  description: string | null
  level_type: 'regular' | 'boss_1' | 'boss_2'
  order_index: number
  question_count: number
  unlock_requirements: any
  mission_type?: 'escape' | 'hit' | 'collect' | 'race' | 'puzzle' | 'defend' | null
  story_intro?: {
    age_5_7?: string
    age_8_10?: string
    age_11_15?: string
  } | null
  story_failure_variants?: Array<{
    age_5_7?: string
    age_8_10?: string
    age_11_15?: string
    failure_type?: string
  }> | null
  boss_environment?: {
    theme?: string
    intensity?: number
    visual_effects?: Record<string, any>
  } | null
}

export interface UserProgress {
  id: string
  user_id: string
  level_id: string
  score: number
  time_taken: number | null
  questions_answered: number
  questions_correct: number
  questions_wrong: number
  passed: boolean
  completed_at: string
  is_boss_level: boolean
}

export interface UserUnlock {
  id: string
  user_id: string
  level_id: string
  unlocked_at: string
}

export interface LeaderboardEntry {
  rank: number
  user_id: string
  full_name: string | null
  avatar_url: string | null
  time_taken: number
  questions_correct: number
  questions_answered: number
  accuracy: number // percentage
  ranking_score: number // calculated score
}

export interface UserStoryState {
  id: string
  user_id: string
  level_id: string
  attempt_count: number
  last_failure_type: string | null
  story_context: Record<string, any>
  created_at: string
  updated_at: string
}

export interface AvatarCustomization {
  skinColor?: string
  hairStyle?: string
  hairColor?: string
  clothing?: string
  accessories?: string[]
  faceFeatures?: Record<string, any>
  bodyType?: string
}

