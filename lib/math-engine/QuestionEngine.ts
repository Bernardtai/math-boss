import { Question } from './types'
import { BodmasGenerator } from './generators/BodmasGenerator'
import { GridMethodGenerator } from './generators/GridMethodGenerator'
import { FractionGenerator } from './generators/FractionGenerator'
import { DecimalGenerator } from './generators/DecimalGenerator'
import { PercentageGenerator } from './generators/PercentageGenerator'
import { AlgebraGenerator } from './generators/AlgebraGenerator'
import { shuffleArray } from './utils'

export class QuestionEngine {
  private generators: Map<string, any> = new Map()

  constructor() {
    this.generators.set('bodmas', new BodmasGenerator())
    this.generators.set('grid_method', new GridMethodGenerator())
    this.generators.set('fractions', new FractionGenerator())
    this.generators.set('decimals', new DecimalGenerator())
    this.generators.set('percentages', new PercentageGenerator())
    this.generators.set('algebra', new AlgebraGenerator())
  }

  /**
   * Generate a set of questions for a level
   */
  generateQuestions(
    topic: string,
    level: number,
    count: number,
    isBoss: boolean = false
  ): Question[] {
    const generator = this.generators.get(topic)
    if (!generator) {
      throw new Error(`No generator found for topic: ${topic}`)
    }

    const questions: Question[] = []
    const usedQuestions = new Set<string>()

    while (questions.length < count) {
      const question = generator.generateQuestion(level, isBoss)
      
      // Avoid duplicate questions
      if (!usedQuestions.has(question.questionText)) {
        // Shuffle options for each question
        question.options = shuffleArray([question.correctAnswer, ...question.options.filter(o => o !== question.correctAnswer)])
        questions.push(question)
        usedQuestions.add(question.questionText)
      }
    }

    return questions
  }

  /**
   * Validate an answer
   */
  validateAnswer(question: Question, userAnswer: string | number): boolean {
    // Convert both to strings for comparison, handling floating point issues
    const correctStr = String(question.correctAnswer)
    const userStr = String(userAnswer)
    
    // Try numeric comparison first
    const correctNum = parseFloat(correctStr)
    const userNum = parseFloat(userStr)
    
    if (!isNaN(correctNum) && !isNaN(userNum)) {
      // Allow small floating point differences
      return Math.abs(correctNum - userNum) < 0.01
    }
    
    // Fall back to string comparison
    return correctStr === userStr
  }
}

