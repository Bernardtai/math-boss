import { MultipleChoiceOptions } from './types'

/**
 * Generate multiple choice options with 1 correct answer and 3 wrong answers
 */
export function generateMultipleChoice(
  correctAnswer: number | string,
  generateWrongAnswers: (correct: number | string) => (number | string)[]
): MultipleChoiceOptions {
  const wrongAnswers = generateWrongAnswers(correctAnswer)
  
  // Shuffle the options
  const allOptions = [correctAnswer, ...wrongAnswers]
  const shuffled = shuffleArray([...allOptions])
  
  return {
    correct: correctAnswer,
    wrong: wrongAnswers,
  }
}

/**
 * Generate wrong answers for numeric questions
 */
export function generateWrongNumericAnswers(
  correct: number,
  count: number = 3,
  variance: number = 0.3
): number[] {
  const wrong: number[] = []
  const used = new Set<number>([correct])
  
  while (wrong.length < count) {
    // Generate wrong answers by adding/subtracting small amounts
    const varianceAmount = Math.abs(correct) * variance
    const variations = [
      correct + Math.floor(Math.random() * varianceAmount) + 1,
      correct - Math.floor(Math.random() * varianceAmount) - 1,
      correct * (1.1 + Math.random() * 0.3),
      correct * (0.7 - Math.random() * 0.2),
      correct + Math.floor(Math.random() * 10) + 5,
      correct - Math.floor(Math.random() * 10) - 5,
    ]
    
    for (const variant of variations) {
      const rounded = Math.round(variant * 100) / 100
      if (!used.has(rounded) && rounded !== correct && rounded > 0) {
        wrong.push(rounded)
        used.add(rounded)
        if (wrong.length >= count) break
      }
    }
  }
  
  return wrong.slice(0, count)
}

/**
 * Generate wrong answers for fraction questions
 */
export function generateWrongFractionAnswers(
  correct: string,
  count: number = 3
): string[] {
  const [num, den] = correct.split('/').map(Number)
  const wrong: string[] = []
  const used = new Set<string>([correct])
  
  while (wrong.length < count) {
    const variations = [
      `${num + 1}/${den}`,
      `${num}/${den + 1}`,
      `${num - 1}/${den}`,
      `${num}/${den - 1}`,
      `${num + 2}/${den + 1}`,
      `${num - 1}/${den + 1}`,
    ]
    
    for (const variant of variations) {
      const [n, d] = variant.split('/').map(Number)
      if (d > 0 && !used.has(variant) && variant !== correct) {
        wrong.push(variant)
        used.add(variant)
        if (wrong.length >= count) break
      }
    }
  }
  
  return wrong.slice(0, count)
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Calculate GCD for fraction simplification
 */
export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

/**
 * Simplify fraction
 */
export function simplifyFraction(numerator: number, denominator: number): [number, number] {
  const divisor = gcd(Math.abs(numerator), Math.abs(denominator))
  return [numerator / divisor, denominator / divisor]
}

/**
 * Format number to avoid floating point issues
 */
export function formatNumber(num: number, decimals: number = 2): number {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

