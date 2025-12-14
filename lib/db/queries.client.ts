import { createClient } from '@/lib/supabase/client'
import { Lesson, Level, UserProgress, UserUnlock } from './types'

// Client-side queries (for use in client components)
export async function getLessonsClient(): Promise<Lesson[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .order('order_index')

  if (error) {
    throw new Error(`Failed to fetch lessons: ${error.message}`)
  }

  return data || []
}

export async function getLessonByIdClient(lessonId: string): Promise<Lesson | null> {
  const supabase = createClient()
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

export async function getLevelsByLessonClient(lessonId: string): Promise<Level[]> {
  const supabase = createClient()
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

export async function getLevelByIdClient(levelId: string): Promise<Level | null> {
  const supabase = createClient()
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

export async function getUserProgressClient(userId: string): Promise<UserProgress[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    throw new Error(`Failed to fetch user progress: ${error.message}`)
  }

  return data || []
}

export async function getUserUnlocksClient(userId: string): Promise<UserUnlock[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_unlocks')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    throw new Error(`Failed to fetch user unlocks: ${error.message}`)
  }

  return data || []
}

