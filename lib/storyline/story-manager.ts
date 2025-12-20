/**
 * Storyline Manager
 * Handles story intros, failure variants, and state tracking
 */

import { createClient } from '@/lib/supabase/client'
import { UserStoryState, Level } from '@/lib/db/types'

export type FailureType = 'timeout' | 'wrong_answers' | 'too_slow' | 'gave_up'

export interface StoryContext {
  attemptCount: number
  lastFailureType: FailureType | null
  storyProgress: Record<string, any>
}

/**
 * Get age group from user age
 */
export function getAgeGroup(age: number | null): 'age_5_7' | 'age_8_10' | 'age_11_15' {
  if (!age) return 'age_8_10'
  if (age >= 5 && age <= 7) return 'age_5_7'
  if (age >= 8 && age <= 10) return 'age_8_10'
  return 'age_11_15'
}

/**
 * Get story intro text for a level based on user age
 */
export function getStoryIntro(level: Level, age: number | null): string {
  const ageGroup = getAgeGroup(age)
  const storyIntro = level.story_intro

  if (!storyIntro) {
    // Default story if none provided
    return `Welcome to ${level.name}! Let's begin your adventure.`
  }

  return storyIntro[ageGroup] || storyIntro.age_8_10 || 'Let\'s begin your adventure!'
}

/**
 * Get failure variant story based on attempt count and failure type
 */
export function getFailureVariant(
  level: Level,
  attemptCount: number,
  failureType: FailureType,
  age: number | null
): string {
  const ageGroup = getAgeGroup(age)
  const variants = level.story_failure_variants || []

  // Find matching variant
  const matchingVariant = variants.find(
    (v) => v.failure_type === failureType || !v.failure_type
  )

  if (matchingVariant) {
    return matchingVariant[ageGroup] || matchingVariant.age_8_10 || 'Try again!'
  }

  // Generate default failure story based on attempt count
  const attemptStories = {
    age_5_7: [
      "Oops! Let's try again!",
      "Almost there! Try once more!",
      "You're doing great! One more try!",
    ],
    age_8_10: [
      "Not quite! But don't worry, let's try again.",
      "Close! The monster tripped, giving you another chance!",
      "You're getting closer! One more attempt!",
    ],
    age_11_15: [
      "The challenge was tough, but you're not giving up. The monster stumbled, giving you an opening to escape again!",
      "Close call! As the monster was about to catch you, it tripped over a rock. You have another chance!",
      "You're learning from each attempt. The monster is getting tired - this is your moment!",
    ],
  }

  const stories = attemptStories[ageGroup]
  const storyIndex = Math.min(attemptCount - 1, stories.length - 1)
  return stories[storyIndex] || stories[0]
}

/**
 * Get or create story state for a user and level
 */
export async function getStoryState(
  userId: string,
  levelId: string
): Promise<UserStoryState | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('user_story_state')
    .select('*')
    .eq('user_id', userId)
    .eq('level_id', levelId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found, create new state
      return createStoryState(userId, levelId)
    }
    console.error('Error fetching story state:', error)
    return null
  }

  return data
}

/**
 * Create new story state
 */
export async function createStoryState(
  userId: string,
  levelId: string
): Promise<UserStoryState | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('user_story_state')
    .insert({
      user_id: userId,
      level_id: levelId,
      attempt_count: 1,
      story_context: {},
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating story state:', error)
    return null
  }

  return data
}

/**
 * Update story state after a failure
 */
export async function updateStoryStateAfterFailure(
  userId: string,
  levelId: string,
  failureType: FailureType
): Promise<UserStoryState | null> {
  const supabase = createClient()

  // Get current state
  const currentState = await getStoryState(userId, levelId)
  const newAttemptCount = (currentState?.attempt_count || 0) + 1

  const { data, error } = await supabase
    .from('user_story_state')
    .upsert(
      {
        user_id: userId,
        level_id: levelId,
        attempt_count: newAttemptCount,
        last_failure_type: failureType,
        story_context: {
          ...currentState?.story_context,
          lastFailure: failureType,
          attemptCount: newAttemptCount,
        },
      },
      {
        onConflict: 'user_id,level_id',
      }
    )
    .select()
    .single()

  if (error) {
    console.error('Error updating story state:', error)
    return null
  }

  return data
}

/**
 * Reset story state (after passing a level)
 */
export async function resetStoryState(
  userId: string,
  levelId: string
): Promise<void> {
  const supabase = createClient()

  await supabase.from('user_story_state').delete().eq('user_id', userId).eq('level_id', levelId)
}

