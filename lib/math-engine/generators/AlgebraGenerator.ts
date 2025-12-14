import { Question, QuestionGenerator } from '../types'
import { generateWrongNumericAnswers, shuffleArray } from '../utils'

export class AlgebraGenerator implements QuestionGenerator {
  generateQuestion(level: number, isBoss: boolean): Question {
    if (level === 1) {
      return this.generateBasics()
    } else if (level === 2) {
      return this.generateSimpleExpressions()
    } else if (level === 3) {
      return this.generateSubstitution()
    } else if (level === 4) {
      return this.generateCombiningTerms()
    } else if (level === 5) {
      return this.generateExpanding()
    } else {
      return this.generateAdvanced(isBoss)
    }
  }

  private generateBasics(): Question {
    const value = Math.floor(Math.random() * 10) + 1
    const answer = value
    const questionText = `If x = ${value}, what is x?`
    
    const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.3)
    const options = shuffleArray([answer, ...wrongAnswers])
    
    return {
      id: `algebra_${Date.now()}_${Math.random()}`,
      questionText,
      correctAnswer: answer,
      options,
      explanation: `If x = ${value}, then x is ${value}`,
      topic: 'algebra',
    }
  }

  private generateSimpleExpressions(): Question {
    const x = Math.floor(Math.random() * 10) + 1
    const a = Math.floor(Math.random() * 5) + 1
    const b = Math.floor(Math.random() * 5) + 1
    const answer = a * x + b
    const questionText = `If x = ${x}, what is ${a}x + ${b}?`
    
    const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.25)
    const options = shuffleArray([answer, ...wrongAnswers])
    
    return {
      id: `algebra_${Date.now()}_${Math.random()}`,
      questionText,
      correctAnswer: answer,
      options,
      explanation: `Substitute x = ${x}: ${a}x + ${b} = ${a}(${x}) + ${b} = ${a * x} + ${b} = ${answer}`,
      topic: 'algebra',
    }
  }

  private generateSubstitution(): Question {
    const x = Math.floor(Math.random() * 10) + 1
    const y = Math.floor(Math.random() * 10) + 1
    const a = Math.floor(Math.random() * 3) + 1
    const b = Math.floor(Math.random() * 3) + 1
    const answer = a * x + b * y
    const questionText = `If x = ${x} and y = ${y}, what is ${a}x + ${b}y?`
    
    const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.25)
    const options = shuffleArray([answer, ...wrongAnswers])
    
    return {
      id: `algebra_${Date.now()}_${Math.random()}`,
      questionText,
      correctAnswer: answer,
      options,
      explanation: `Substitute x = ${x} and y = ${y}: ${a}x + ${b}y = ${a}(${x}) + ${b}(${y}) = ${a * x} + ${b * y} = ${answer}`,
      topic: 'algebra',
    }
  }

  private generateCombiningTerms(): Question {
    const a = Math.floor(Math.random() * 5) + 1
    const b = Math.floor(Math.random() * 5) + 1
    const answer = a + b
    const questionText = `Simplify: ${a}x + ${b}x`
    
    const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.3)
    const options = shuffleArray([answer, ...wrongAnswers])
    
    return {
      id: `algebra_${Date.now()}_${Math.random()}`,
      questionText,
      correctAnswer: answer,
      options,
      explanation: `Combine like terms: ${a}x + ${b}x = (${a} + ${b})x = ${answer}x`,
      topic: 'algebra',
    }
  }

  private generateExpanding(): Question {
    const a = Math.floor(Math.random() * 5) + 2
    const b = Math.floor(Math.random() * 5) + 1
    const c = Math.floor(Math.random() * 5) + 1
    const answer = a * b + a * c
    const questionText = `Expand: ${a}(x + ${b}) where x = ${c}`
    
    const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.25)
    const options = shuffleArray([answer, ...wrongAnswers])
    
    return {
      id: `algebra_${Date.now()}_${Math.random()}`,
      questionText,
      correctAnswer: answer,
      options,
      explanation: `Expand: ${a}(x + ${b}) = ${a}x + ${a * b}. Substitute x = ${c}: ${a}(${c}) + ${a * b} = ${a * c} + ${a * b} = ${answer}`,
      topic: 'algebra',
    }
  }

  private generateAdvanced(isBoss: boolean): Question {
    if (isBoss) {
      const x = Math.floor(Math.random() * 10) + 1
      const y = Math.floor(Math.random() * 10) + 1
      const a = Math.floor(Math.random() * 3) + 2
      const b = Math.floor(Math.random() * 3) + 1
      const c = Math.floor(Math.random() * 3) + 1
      const answer = a * x + b * y + c
      const questionText = `If x = ${x} and y = ${y}, what is ${a}x + ${b}y + ${c}?`
      
      const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.2)
      const options = shuffleArray([answer, ...wrongAnswers])
      
      return {
        id: `algebra_${Date.now()}_${Math.random()}`,
        questionText,
        correctAnswer: answer,
        options,
        explanation: `Substitute x = ${x} and y = ${y}: ${a}x + ${b}y + ${c} = ${a}(${x}) + ${b}(${y}) + ${c} = ${a * x} + ${b * y} + ${c} = ${answer}`,
        topic: 'algebra',
      }
    } else {
      const x = Math.floor(Math.random() * 10) + 1
      const a = Math.floor(Math.random() * 5) + 2
      const b = Math.floor(Math.random() * 5) + 1
      const answer = a * x * x + b * x
      const questionText = `If x = ${x}, what is ${a}x² + ${b}x?`
      
      const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.25)
      const options = shuffleArray([answer, ...wrongAnswers])
      
      return {
        id: `algebra_${Date.now()}_${Math.random()}`,
        questionText,
        correctAnswer: answer,
        options,
        explanation: `Substitute x = ${x}: ${a}x² + ${b}x = ${a}(${x})² + ${b}(${x}) = ${a * x * x} + ${b * x} = ${answer}`,
        topic: 'algebra',
      }
    }
  }
}

