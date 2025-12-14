import { Question, QuestionGenerator } from '../types'
import { generateWrongNumericAnswers, shuffleArray, formatNumber } from '../utils'

export class PercentageGenerator implements QuestionGenerator {
  generateQuestion(level: number, isBoss: boolean): Question {
    if (level === 1) {
      return this.generateBasics()
    } else if (level === 2) {
      return this.generateConversion()
    } else if (level === 3) {
      return this.generatePercentageOf()
    } else if (level === 4) {
      return this.generateIncrease()
    } else if (level === 5) {
      return this.generateDecrease()
    } else {
      return this.generateComplex(isBoss)
    }
  }

  private generateBasics(): Question {
    const num = Math.floor(Math.random() * 4) + 1
    const den = num * 4
    const percentage = (num / den) * 100
    const answer = formatNumber(percentage, 1)
    const questionText = `What percentage is ${num} out of ${den}?`
    
    const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.3)
    const options = shuffleArray([answer, ...wrongAnswers])
    
    return {
      id: `percentage_${Date.now()}_${Math.random()}`,
      questionText,
      correctAnswer: answer,
      options,
      explanation: `Percentage = (${num} ÷ ${den}) × 100 = ${percentage}%`,
      topic: 'percentages',
    }
  }

  private generateConversion(): Question {
    const decimal = Math.random() * 0.9 + 0.1
    const percentage = formatNumber(decimal * 100, 1)
    const answer = formatNumber(decimal, 2)
    const questionText = `Convert ${percentage}% to a decimal`
    
    const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.3)
    const options = shuffleArray([answer, ...wrongAnswers])
    
    return {
      id: `percentage_${Date.now()}_${Math.random()}`,
      questionText,
      correctAnswer: answer,
      options,
      explanation: `To convert percentage to decimal, divide by 100: ${percentage}% = ${percentage} ÷ 100 = ${answer}`,
      topic: 'percentages',
    }
  }

  private generatePercentageOf(): Question {
    const number = Math.floor(Math.random() * 200) + 50
    const percentage = Math.floor(Math.random() * 40) + 10
    const answer = formatNumber((number * percentage) / 100, 2)
    const questionText = `What is ${percentage}% of ${number}?`
    
    const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.25)
    const options = shuffleArray([answer, ...wrongAnswers])
    
    return {
      id: `percentage_${Date.now()}_${Math.random()}`,
      questionText,
      correctAnswer: answer,
      options,
      explanation: `${percentage}% of ${number} = (${percentage} ÷ 100) × ${number} = ${percentage / 100} × ${number} = ${answer}`,
      topic: 'percentages',
    }
  }

  private generateIncrease(): Question {
    const original = Math.floor(Math.random() * 200) + 50
    const percentage = Math.floor(Math.random() * 30) + 10
    const increase = (original * percentage) / 100
    const answer = formatNumber(original + increase, 2)
    const questionText = `Increase ${original} by ${percentage}%`
    
    const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.25)
    const options = shuffleArray([answer, ...wrongAnswers])
    
    return {
      id: `percentage_${Date.now()}_${Math.random()}`,
      questionText,
      correctAnswer: answer,
      options,
      explanation: `Increase = ${original} × (${percentage} ÷ 100) = ${original} × ${percentage / 100} = ${formatNumber(increase, 2)}. New value = ${original} + ${formatNumber(increase, 2)} = ${answer}`,
      topic: 'percentages',
    }
  }

  private generateDecrease(): Question {
    const original = Math.floor(Math.random() * 200) + 50
    const percentage = Math.floor(Math.random() * 30) + 10
    const decrease = (original * percentage) / 100
    const answer = formatNumber(original - decrease, 2)
    const questionText = `Decrease ${original} by ${percentage}%`
    
    const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.25)
    const options = shuffleArray([answer, ...wrongAnswers])
    
    return {
      id: `percentage_${Date.now()}_${Math.random()}`,
      questionText,
      correctAnswer: answer,
      options,
      explanation: `Decrease = ${original} × (${percentage} ÷ 100) = ${original} × ${percentage / 100} = ${formatNumber(decrease, 2)}. New value = ${original} - ${formatNumber(decrease, 2)} = ${answer}`,
      topic: 'percentages',
    }
  }

  private generateComplex(isBoss: boolean): Question {
    if (isBoss) {
      const original = Math.floor(Math.random() * 300) + 100
      const percentage1 = Math.floor(Math.random() * 20) + 10
      const percentage2 = Math.floor(Math.random() * 15) + 5
      
      // First increase, then decrease
      const afterIncrease = original * (1 + percentage1 / 100)
      const answer = formatNumber(afterIncrease * (1 - percentage2 / 100), 2)
      const questionText = `${original} increased by ${percentage1}%, then decreased by ${percentage2}%`
      
      const wrongAnswers = generateWrongNumericAnswers(answer, 3, 0.2)
      const options = shuffleArray([answer, ...wrongAnswers])
      
      return {
        id: `percentage_${Date.now()}_${Math.random()}`,
        questionText,
        correctAnswer: answer,
        options,
        explanation: `First increase: ${original} × 1.${percentage1} = ${formatNumber(afterIncrease, 2)}. Then decrease: ${formatNumber(afterIncrease, 2)} × 0.${100 - percentage2} = ${answer}`,
        topic: 'percentages',
      }
    } else {
      return this.generatePercentageOf()
    }
  }
}

