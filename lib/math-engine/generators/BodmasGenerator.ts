import { Question, QuestionGenerator } from '../types'
import { generateWrongNumericAnswers, shuffleArray, formatNumber } from '../utils'

export class BodmasGenerator implements QuestionGenerator {
  generateQuestion(level: number, isBoss: boolean): Question {
    const difficulty = isBoss ? level + 3 : level
    
    // Generate question based on level
    if (level === 1) {
      return this.generateSimpleAddition()
    } else if (level === 2) {
      return this.generateAdditionSubtraction()
    } else if (level === 3) {
      return this.generateMultiplication()
    } else if (level === 4) {
      return this.generateDivision()
    } else if (level === 5) {
      return this.generateMixedOperations()
    } else if (level === 6) {
      return this.generateWithParentheses()
    } else {
      return this.generateComplexBodmas(isBoss)
    }
  }

  private generateSimpleAddition(): Question {
    const a = Math.floor(Math.random() * 50) + 1
    const b = Math.floor(Math.random() * 50) + 1
    const answer = a + b
    const questionText = `${a} + ${b} = ?`
    
    const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.2)
    const options = shuffleArray([answer, ...wrongAnswers])
    
    return {
      id: `bodmas_${Date.now()}_${Math.random()}`,
      questionText,
      correctAnswer: answer,
      options,
      explanation: `Add ${a} and ${b}: ${a} + ${b} = ${answer}`,
      topic: 'bodmas',
    }
  }

  private generateAdditionSubtraction(): Question {
    const a = Math.floor(Math.random() * 100) + 1
    const b = Math.floor(Math.random() * 50) + 1
    const c = Math.floor(Math.random() * 30) + 1
    const answer = a + b - c
    const questionText = `${a} + ${b} - ${c} = ?`
    
    const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.2)
    const options = shuffleArray([answer, ...wrongAnswers])
    
    return {
      id: `bodmas_${Date.now()}_${Math.random()}`,
      questionText,
      correctAnswer: answer,
      options,
      explanation: `First add ${a} + ${b} = ${a + b}, then subtract ${c}: ${a + b} - ${c} = ${answer}`,
      topic: 'bodmas',
    }
  }

  private generateMultiplication(): Question {
    const a = Math.floor(Math.random() * 12) + 1
    const b = Math.floor(Math.random() * 12) + 1
    const answer = a * b
    const questionText = `${a} × ${b} = ?`
    
    const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.3)
    const options = shuffleArray([answer, ...wrongAnswers])
    
    return {
      id: `bodmas_${Date.now()}_${Math.random()}`,
      questionText,
      correctAnswer: answer,
      options,
      explanation: `Multiply ${a} by ${b}: ${a} × ${b} = ${answer}`,
      topic: 'bodmas',
    }
  }

  private generateDivision(): Question {
    const b = Math.floor(Math.random() * 10) + 2
    const answer = Math.floor(Math.random() * 10) + 1
    const a = b * answer
    const questionText = `${a} ÷ ${b} = ?`
    
    const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.3)
    const options = shuffleArray([answer, ...wrongAnswers])
    
    return {
      id: `bodmas_${Date.now()}_${Math.random()}`,
      questionText,
      correctAnswer: answer,
      options,
      explanation: `Divide ${a} by ${b}: ${a} ÷ ${b} = ${answer}`,
      topic: 'bodmas',
    }
  }

  private generateMixedOperations(): Question {
    const a = Math.floor(Math.random() * 20) + 1
    const b = Math.floor(Math.random() * 10) + 1
    const c = Math.floor(Math.random() * 10) + 1
    const answer = a + b * c
    const questionText = `${a} + ${b} × ${c} = ?`
    
    const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.25)
    const options = shuffleArray([answer, ...wrongAnswers])
    
    return {
      id: `bodmas_${Date.now()}_${Math.random()}`,
      questionText,
      correctAnswer: answer,
      options,
      explanation: `Follow BODMAS: First multiply ${b} × ${c} = ${b * c}, then add ${a}: ${a} + ${b * c} = ${answer}`,
      topic: 'bodmas',
    }
  }

  private generateWithParentheses(): Question {
    const a = Math.floor(Math.random() * 10) + 1
    const b = Math.floor(Math.random() * 10) + 1
    const c = Math.floor(Math.random() * 10) + 1
    const answer = (a + b) * c
    const questionText = `(${a} + ${b}) × ${c} = ?`
    
    const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.25)
    const options = shuffleArray([answer, ...wrongAnswers])
    
    return {
      id: `bodmas_${Date.now()}_${Math.random()}`,
      questionText,
      correctAnswer: answer,
      options,
      explanation: `First solve parentheses: (${a} + ${b}) = ${a + b}, then multiply by ${c}: ${a + b} × ${c} = ${answer}`,
      topic: 'bodmas',
    }
  }

  private generateComplexBodmas(isBoss: boolean): Question {
    if (isBoss) {
      const a = Math.floor(Math.random() * 20) + 1
      const b = Math.floor(Math.random() * 10) + 1
      const c = Math.floor(Math.random() * 10) + 1
      const d = Math.floor(Math.random() * 10) + 1
      const answer = a + b * c - d
      const questionText = `${a} + ${b} × ${c} - ${d} = ?`
      
      const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.3)
      const options = shuffleArray([answer, ...wrongAnswers])
      
      return {
        id: `bodmas_${Date.now()}_${Math.random()}`,
        questionText,
        correctAnswer: answer,
        options,
        explanation: `Follow BODMAS: First multiply ${b} × ${c} = ${b * c}, then ${a} + ${b * c} = ${a + b * c}, finally subtract ${d}: ${a + b * c} - ${d} = ${answer}`,
        topic: 'bodmas',
      }
    } else {
      const a = Math.floor(Math.random() * 15) + 1
      const b = Math.floor(Math.random() * 8) + 1
      const c = Math.floor(Math.random() * 8) + 1
      const answer = a * b + c
      const questionText = `${a} × ${b} + ${c} = ?`
      
      const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.25)
      const options = shuffleArray([answer, ...wrongAnswers])
      
      return {
        id: `bodmas_${Date.now()}_${Math.random()}`,
        questionText,
        correctAnswer: answer,
        options,
        explanation: `Follow BODMAS: First multiply ${a} × ${b} = ${a * b}, then add ${c}: ${a * b} + ${c} = ${answer}`,
        topic: 'bodmas',
      }
    }
  }
}

