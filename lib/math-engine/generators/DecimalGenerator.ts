import { Question, QuestionGenerator } from '../types'
import { generateWrongNumericAnswers, shuffleArray, formatNumber } from '../utils'

export class DecimalGenerator implements QuestionGenerator {
  generateQuestion(level: number, isBoss: boolean): Question {
    if (level === 1) {
      return this.generateBasics()
    } else if (level === 2) {
      return this.generateAddition()
    } else if (level === 3) {
      return this.generateSubtraction()
    } else if (level === 4) {
      return this.generateMultiplication()
    } else if (level === 5) {
      return this.generateDivision()
    } else {
      return this.generateMixed(isBoss)
    }
  }

  private generateBasics(): Question {
    const num = Math.floor(Math.random() * 90) + 10
    const decimal = num / 100
    const answer = formatNumber(decimal, 2)
    const questionText = `Convert ${num}% to a decimal`
    
    const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.3)
    const options = shuffleArray([answer, ...wrongAnswers])
    
    return {
      id: `decimal_${Date.now()}_${Math.random()}`,
      questionText,
      correctAnswer: answer,
      options,
      explanation: `To convert percentage to decimal, divide by 100: ${num}% = ${num} ÷ 100 = ${answer}`,
      topic: 'decimals',
    }
  }

  private generateAddition(): Question {
    const a = formatNumber((Math.random() * 100), 2)
    const b = formatNumber((Math.random() * 100), 2)
    const answer = formatNumber(a + b, 2)
    const questionText = `${a} + ${b} = ?`
    
    const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.2)
    const options = shuffleArray([answer, ...wrongAnswers])
    
    return {
      id: `decimal_${Date.now()}_${Math.random()}`,
      questionText,
      correctAnswer: answer,
      options,
      explanation: `Add decimals: ${a} + ${b} = ${answer}. Align decimal points and add.`,
      topic: 'decimals',
    }
  }

  private generateSubtraction(): Question {
    const a = formatNumber((Math.random() * 100) + 10, 2)
    const b = formatNumber(Math.random() * (a - 1), 2)
    const answer = formatNumber(a - b, 2)
    const questionText = `${a} - ${b} = ?`
    
    const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.2)
    const options = shuffleArray([answer, ...wrongAnswers])
    
    return {
      id: `decimal_${Date.now()}_${Math.random()}`,
      questionText,
      correctAnswer: answer,
      options,
      explanation: `Subtract decimals: ${a} - ${b} = ${answer}. Align decimal points and subtract.`,
      topic: 'decimals',
    }
  }

  private generateMultiplication(): Question {
    const a = formatNumber((Math.random() * 20) + 1, 1)
    const b = formatNumber((Math.random() * 10) + 1, 1)
    const answer = formatNumber(a * b, 2)
    const questionText = `${a} × ${b} = ?`
    
    const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.25)
    const options = shuffleArray([answer, ...wrongAnswers])
    
    return {
      id: `decimal_${Date.now()}_${Math.random()}`,
      questionText,
      correctAnswer: answer,
      options,
      explanation: `Multiply decimals: ${a} × ${b} = ${answer}. Multiply as whole numbers, then count decimal places.`,
      topic: 'decimals',
    }
  }

  private generateDivision(): Question {
    const b = formatNumber((Math.random() * 5) + 1, 1)
    const answer = formatNumber((Math.random() * 10) + 1, 1)
    const a = formatNumber(b * answer, 2)
    const questionText = `${a} ÷ ${b} = ?`
    
    const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.25)
    const options = shuffleArray([answer, ...wrongAnswers])
    
    return {
      id: `decimal_${Date.now()}_${Math.random()}`,
      questionText,
      correctAnswer: answer,
      options,
      explanation: `Divide decimals: ${a} ÷ ${b} = ${answer}. Move decimal points and divide.`,
      topic: 'decimals',
    }
  }

  private generateMixed(isBoss: boolean): Question {
    if (isBoss) {
      const a = formatNumber((Math.random() * 50) + 10, 2)
      const b = formatNumber((Math.random() * 10) + 1, 1)
      const c = formatNumber((Math.random() * 5) + 1, 1)
      const answer = formatNumber(a + b * c, 2)
      const questionText = `${a} + ${b} × ${c} = ?`
      
      const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.25)
      const options = shuffleArray([answer, ...wrongAnswers])
      
      return {
        id: `decimal_${Date.now()}_${Math.random()}`,
        questionText,
        correctAnswer: answer,
        options,
        explanation: `Follow order of operations: First multiply ${b} × ${c} = ${formatNumber(b * c, 2)}, then add ${a}: ${a} + ${formatNumber(b * c, 2)} = ${answer}`,
        topic: 'decimals',
      }
    } else {
      const a = formatNumber((Math.random() * 20) + 5, 2)
      const b = formatNumber((Math.random() * 10) + 1, 1)
      const answer = formatNumber(a + b, 2)
      const questionText = `${a} + ${b} = ?`
      
      const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.2)
      const options = shuffleArray([answer, ...wrongAnswers])
      
      return {
        id: `decimal_${Date.now()}_${Math.random()}`,
        questionText,
        correctAnswer: answer,
        options,
        explanation: `Add decimals: ${a} + ${b} = ${answer}`,
        topic: 'decimals',
      }
    }
  }
}

