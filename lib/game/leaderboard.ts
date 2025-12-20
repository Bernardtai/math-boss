/**
 * Leaderboard ranking calculation utilities
 */

/**
 * Calculate ranking score based on accuracy and time taken
 * Formula: ((correct_answers / total_questions) * 100) / (time_taken / 100)
 * Higher score = better rank
 * 
 * @param correct - Number of correct answers
 * @param total - Total number of questions
 * @param timeTaken - Time taken in seconds
 * @returns Ranking score (higher is better)
 */
export function calculateRankingScore(
  correct: number,
  total: number,
  timeTaken: number
): number {
  // Handle edge cases
  if (total === 0) return 0
  if (timeTaken === 0 || timeTaken < 1) {
    // If time is 0 or less than 1 second, use 1 second to avoid division by zero
    // This gives a very high score for extremely fast completions
    timeTaken = 1
  }

  // Calculate accuracy percentage
  const accuracyPercentage = (correct / total) * 100

  // Calculate normalized time (time_taken / 100)
  const normalizedTime = timeTaken / 100

  // Ranking score: accuracy / normalized_time
  // Higher accuracy and lower time = higher score
  const rankingScore = accuracyPercentage / normalizedTime

  return rankingScore
}

/**
 * Format time in seconds to MM:SS format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Format accuracy as percentage string
 */
export function formatAccuracy(correct: number, total: number): string {
  if (total === 0) return '0%'
  const percentage = (correct / total) * 100
  return `${percentage.toFixed(1)}%`
}

