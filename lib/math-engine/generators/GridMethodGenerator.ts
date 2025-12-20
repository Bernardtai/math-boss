import { Question, QuestionGenerator } from '../types'
import { generateWrongNumericAnswers, shuffleArray } from '../utils'

export class GridMethodGenerator implements QuestionGenerator {
  generateQuestion(level: number, isBoss: boolean): Question {
    if (level === 1) {
      return this.generateSingleDigit()
    } else if (level === 2) {
      return this.generateTwoDigit()
    } else {
      return this.generateAdvanced(isBoss)
    }
  }

  private generateSingleDigit(): Question {
    const a = Math.floor(Math.random() * 9) + 1
    const b = Math.floor(Math.random() * 9) + 1
    const answer = a * b
    const questionText = `${a} × ${b} = ?`
    
    const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.3)
    const options = shuffleArray([answer, ...wrongAnswers])
    
    return {
      id: `grid_${Date.now()}_${Math.random()}`,
      questionText,
      correctAnswer: answer,
      options,
      explanation: `Using grid method: Split ${a} × ${b}. ${a} × ${b} = ${answer}`,
      topic: 'grid_method',
    }
  }

  private generateTwoDigit(): Question {
    const a = Math.floor(Math.random() * 90) + 10
    const b = Math.floor(Math.random() * 9) + 1
    const answer = a * b
    const questionText = `${a} × ${b} = ?`
    
    const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.25)
    const options = shuffleArray([answer, ...wrongAnswers])
    
    const tens = Math.floor(a / 10)
    const ones = a % 10
    
    return {
      id: `grid_${Date.now()}_${Math.random()}`,
      questionText,
      correctAnswer: answer,
      options,
      explanation: `Using grid method: ${a} = ${tens}0 + ${ones}, so ${a} × ${b} = (${tens}0 × ${b}) + (${ones} × ${b}) = ${tens * 10 * b} + ${ones * b} = ${answer}`,
      topic: 'grid_method',
    }
  }

  private generateAdvanced(isBoss: boolean): Question {
    if (isBoss) {
      const a = Math.floor(Math.random() * 90) + 10
      const b = Math.floor(Math.random() * 90) + 10
      const answer = a * b
      const questionText = `${a} × ${b} = ?`
      
      const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.2)
      const options = shuffleArray([answer, ...wrongAnswers])
      
      return {
        id: `grid_${Date.now()}_${Math.random()}`,
        questionText,
        correctAnswer: answer,
        options,
        explanation: `Using grid method: ${a} × ${b} = ${answer}. Break into parts: (${Math.floor(a/10)}0 × ${Math.floor(b/10)}0) + (${Math.floor(a/10)}0 × ${b%10}) + (${a%10} × ${Math.floor(b/10)}0) + (${a%10} × ${b%10}) = ${answer}`,
        topic: 'grid_method',
      }
    } else {
      const a = Math.floor(Math.random() * 50) + 10
      const b = Math.floor(Math.random() * 9) + 1
      const answer = a * b
      const questionText = `${a} × ${b} = ?`
      
      const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.25)
      const options = shuffleArray([answer, ...wrongAnswers])
      
      return {
        id: `grid_${Date.now()}_${Math.random()}`,
        questionText,
        correctAnswer: answer,
        options,
        explanation: `Using grid method: ${a} × ${b} = ${answer}`,
        topic: 'grid_method',
      }
    }
  }
}

