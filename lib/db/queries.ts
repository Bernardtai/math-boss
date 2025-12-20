import { createClient } from '@/lib/supabase/server'
import { Lesson, Level, UserProgress, UserUnlock, LeaderboardEntry } from './types'
import { calculateRankingScore } from '@/lib/game/leaderboard'

// Re-export types for backward compatibility
export type { Lesson, Level, UserProgress, UserUnlock, LeaderboardEntry }

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

export async function getLevelLeaderboard(levelId: string, limit: number = 10): Promise<LeaderboardEntry[]> {
  const supabase = await createClient()
  
  // Fetch user progress with profile data
  const { data, error } = await supabase
    .from('user_progress')
    .select(`
      user_id,
      time_taken,
      questions_correct,
      questions_answered,
      profiles:user_id (
        full_name,
        avatar_url
      )
    `)
    .eq('level_id', levelId)
    .eq('passed', true)
    .not('time_taken', 'is', null)

  if (error) {
    throw new Error(`Failed to fetch leaderboard: ${error.message}`)
  }

  if (!data || data.length === 0) {
    return []
}

  // Calculate ranking scores and create entries
  const entries: LeaderboardEntry[] = data
    .map((item: any) => {
      const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
      const rankingScore = calculateRankingScore(
        item.questions_correct,
        item.questions_answered,
        item.time_taken
      )
      const accuracy = (item.questions_correct / item.questions_answered) * 100

      return {
        rank: 0, // Will be set after sorting
        user_id: item.user_id,
        full_name: profile?.full_name || null,
        avatar_url: profile?.avatar_url || null,
        time_taken: item.time_taken,
        questions_correct: item.questions_correct,
        questions_answered: item.questions_answered,
        accuracy,
        ranking_score: rankingScore,
      }
    })
    .sort((a, b) => {
      // Sort by ranking_score DESC, then time_taken ASC (tiebreaker)
      if (b.ranking_score !== a.ranking_score) {
        return b.ranking_score - a.ranking_score
      }
      return a.time_taken - b.time_taken
    })
    .slice(0, limit)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }))

  return entries
}

export async function getUserLeaderboardRank(levelId: string, userId: string): Promise<LeaderboardEntry | null> {
  const supabase = await createClient()
  
  // Fetch all passed entries for ranking calculation
  const { data, error } = await supabase
    .from('user_progress')
    .select(`
      user_id,
      time_taken,
      questions_correct,
      questions_answered,
      profiles:user_id (
        full_name,
        avatar_url
      )
    `)
    .eq('level_id', levelId)
    .eq('passed', true)
    .not('time_taken', 'is', null)

  if (error) {
    throw new Error(`Failed to fetch user rank: ${error.message}`)
  }

  if (!data || data.length === 0) {
    return null
  }

  // Calculate ranking scores and sort
  const entries: LeaderboardEntry[] = data
    .map((item: any) => {
      const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
      const rankingScore = calculateRankingScore(
        item.questions_correct,
        item.questions_answered,
        item.time_taken
      )
      const accuracy = (item.questions_correct / item.questions_answered) * 100

      return {
        rank: 0, // Will be set after sorting
        user_id: item.user_id,
        full_name: profile?.full_name || null,
        avatar_url: profile?.avatar_url || null,
        time_taken: item.time_taken,
        questions_correct: item.questions_correct,
        questions_answered: item.questions_answered,
        accuracy,
        ranking_score: rankingScore,
      }
    })
    .sort((a, b) => {
      // Sort by ranking_score DESC, then time_taken ASC (tiebreaker)
      if (b.ranking_score !== a.ranking_score) {
        return b.ranking_score - a.ranking_score
      }
      return a.time_taken - b.time_taken
    })
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }))

  // Find user's entry
  const userEntry = entries.find(entry => entry.user_id === userId)
  return userEntry || null
}

