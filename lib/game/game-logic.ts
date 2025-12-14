import { GameState, Answer } from './game-state'
import { Question } from '@/lib/math-engine/types'
import { QuestionEngine } from '@/lib/math-engine/QuestionEngine'

const questionEngine = new QuestionEngine()

/**
 * Check if user passed the level
 * Regular levels: max 4 wrong (need at least 6/10 correct)
 * Boss levels: max 8 wrong (need at least 17/25 correct)
 */
export function checkPassFail(state: GameState, isBossLevel: boolean): boolean {
  if (isBossLevel) {
    return state.wrongAnswers <= 8
  } else {
    return state.wrongAnswers <= 4
  }
}

/**
 * Calculate final score
 */
export function calculateScore(state: GameState, isBossLevel: boolean): number {
  const baseScore = state.correctAnswers * 100
  const timeBonus = Math.max(0, 1000 - state.timer * 10) // Time bonus decreases with time
  const bossMultiplier = isBossLevel ? 2 : 1
  
  return Math.floor((baseScore + timeBonus) * bossMultiplier)
}

/**
 * Get grade based on performance
 */
export function getGrade(correct: number, total: number): string {
  const percentage = (correct / total) * 100
  
  if (percentage >= 90) return 'A+'
  if (percentage >= 80) return 'A'
  if (percentage >= 70) return 'B'
  if (percentage >= 60) return 'C'
  if (percentage >= 50) return 'D'
  return 'F'
}

/**
 * Validate answer using question engine
 */
export function validateAnswer(question: Question, userAnswer: string | number): boolean {
  return questionEngine.validateAnswer(question, userAnswer)
}

/**
 * Get incorrectly answered questions for tutorial
 */
export function getIncorrectQuestions(state: GameState): Question[] {
  const incorrectQuestionIds = state.answers
    .filter((answer) => !answer.isCorrect)
    .map((answer) => answer.questionId)
  
  return state.questions.filter((question) =>
    incorrectQuestionIds.includes(question.id)
  )
}

