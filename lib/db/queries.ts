import { createClient } from '@/lib/supabase/server'
import { Lesson, Level, UserProgress, UserUnlock } from './types'

// Re-export types for backward compatibility
export type { Lesson, Level, UserProgress, UserUnlock }

// Server-side queries
export async function getLessons(): Promise<Lesson[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .order('order_index')

  if (error) {
    throw new Error(`Failed to fetch lessons: ${error.message}`)
  }

  return data || []
}

export async function getLessonById(lessonId: string): Promise<Lesson | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    throw new Error(`Failed to fetch lesson: ${error.message}`)
  }

  return data
}

export async function getLevelsByLesson(lessonId: string): Promise<Level[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('levels')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('order_index')

  if (error) {
    throw new Error(`Failed to fetch levels: ${error.message}`)
  }

  return data || []
}

export async function getLevelById(levelId: string): Promise<Level | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('levels')
    .select('*')
    .eq('id', levelId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    throw new Error(`Failed to fetch level: ${error.message}`)
  }

  return data
}

export async function getUserProgress(userId: string): Promise<UserProgress[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    throw new Error(`Failed to fetch user progress: ${error.message}`)
  }

  return data || []
}

export async function getUserProgressForLevel(
  userId: string,
  levelId: string
): Promise<UserProgress | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('level_id', levelId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    throw new Error(`Failed to fetch user progress: ${error.message}`)
  }

  return data
}

export async function getUserUnlocks(userId: string): Promise<UserUnlock[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_unlocks')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    throw new Error(`Failed to fetch user unlocks: ${error.message}`)
  }

  return data || []
}

export async function saveUserProgress(progress: {
  user_id: string
  level_id: string
  score: number
  time_taken: number
  questions_answered: number
  questions_correct: number
  questions_wrong: number
  passed: boolean
  is_boss_level: boolean
}): Promise<UserProgress> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_progress')
    .upsert(progress, {
      onConflict: 'user_id,level_id',
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to save user progress: ${error.message}`)
  }

  return data
}

export async function unlockLevel(userId: string, levelId: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('user_unlocks')
    .insert({
      user_id: userId,
      level_id: levelId,
    })

  if (error) {
    // Ignore duplicate key errors (level already unlocked)
    if (error.code !== '23505') {
      throw new Error(`Failed to unlock level: ${error.message}`)
    }
  }
}

