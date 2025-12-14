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

