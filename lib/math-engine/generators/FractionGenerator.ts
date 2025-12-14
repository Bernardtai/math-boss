import { Question, QuestionGenerator } from '../types'
import { generateWrongFractionAnswers, shuffleArray, simplifyFraction, gcd } from '../utils'

export class FractionGenerator implements QuestionGenerator {
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
    } else if (level === 6) {
      return this.generateMixedNumbers()
    } else if (level === 7) {
      return this.generateComplex()
    } else {
      return this.generateAdvanced(isBoss)
    }
  }

  private generateBasics(): Question {
    const num = Math.floor(Math.random() * 8) + 1
    const den = Math.floor(Math.random() * 8) + num
    const answer = `${num}/${den}`
    const questionText = `What is ${num} out of ${den} as a fraction?`
    
    const wrongAnswers = generateWrongFractionAnswers(answer, 3)
    const options = shuffleArray([answer, ...wrongAnswers])
    
    return {
      id: `fraction_${Date.now()}_${Math.random()}`,
      questionText,
      correctAnswer: answer,
      options,
      explanation: `${num} out of ${den} is written as ${num}/${den}`,
      topic: 'fractions',
    }
  }

  private generateAddition(): Question {
    const num1 = Math.floor(Math.random() * 5) + 1
    const den1 = Math.floor(Math.random() * 5) + num1
    const num2 = Math.floor(Math.random() * 5) + 1
    const den2 = den1 // Same denominator for simplicity
    
    const numAnswer = num1 + num2
    const [simplifiedNum, simplifiedDen] = simplifyFraction(numAnswer, den1)
    const answer = simplifiedDen === 1 ? `${simplifiedNum}` : `${simplifiedNum}/${simplifiedDen}`
    const questionText = `${num1}/${den1} + ${num2}/${den2} = ?`
    
    const wrongAnswers = generateWrongFractionAnswers(answer, 3)
    const options = shuffleArray([answer, ...wrongAnswers])
    
    return {
      id: `fraction_${Date.now()}_${Math.random()}`,
      questionText,
      correctAnswer: answer,
      options,
      explanation: `Add numerators: ${num1} + ${num2} = ${numAnswer}, keep denominator ${den1}. ${numAnswer}/${den1}${simplifiedDen !== den1 ? ` = ${answer}` : ''}`,
      topic: 'fractions',
    }
  }

  private generateSubtraction(): Question {
    const num1 = Math.floor(Math.random() * 5) + 3
    const num2 = Math.floor(Math.random() * (num1 - 1)) + 1
    const den = Math.floor(Math.random() * 5) + num1
    
    const numAnswer = num1 - num2
    const [simplifiedNum, simplifiedDen] = simplifyFraction(numAnswer, den)
    const answer = simplifiedDen === 1 ? `${simplifiedNum}` : `${simplifiedNum}/${simplifiedDen}`
    const questionText = `${num1}/${den} - ${num2}/${den} = ?`
    
    const wrongAnswers = generateWrongFractionAnswers(answer, 3)
    const options = shuffleArray([answer, ...wrongAnswers])
    
    return {
      id: `fraction_${Date.now()}_${Math.random()}`,
      questionText,
      correctAnswer: answer,
      options,
      explanation: `Subtract numerators: ${num1} - ${num2} = ${numAnswer}, keep denominator ${den}. ${numAnswer}/${den}${simplifiedDen !== den ? ` = ${answer}` : ''}`,
      topic: 'fractions',
    }
  }

  private generateMultiplication(): Question {
    const num1 = Math.floor(Math.random() * 5) + 1
    const den1 = Math.floor(Math.random() * 5) + num1
    const num2 = Math.floor(Math.random() * 5) + 1
    const den2 = Math.floor(Math.random() * 5) + num2
    
    const numAnswer = num1 * num2
    const denAnswer = den1 * den2
    const [simplifiedNum, simplifiedDen] = simplifyFraction(numAnswer, denAnswer)
    const answer = `${simplifiedNum}/${simplifiedDen}`
    const questionText = `${num1}/${den1} × ${num2}/${den2} = ?`
    
    const wrongAnswers = generateWrongFractionAnswers(answer, 3)
    const options = shuffleArray([answer, ...wrongAnswers])
    
    return {
      id: `fraction_${Date.now()}_${Math.random()}`,
      questionText,
      correctAnswer: answer,
      options,
      explanation: `Multiply numerators: ${num1} × ${num2} = ${numAnswer}, multiply denominators: ${den1} × ${den2} = ${denAnswer}. ${numAnswer}/${denAnswer}${simplifiedDen !== denAnswer ? ` = ${answer}` : ''}`,
      topic: 'fractions',
    }
  }

  private generateDivision(): Question {
    const num1 = Math.floor(Math.random() * 5) + 1
    const den1 = Math.floor(Math.random() * 5) + num1
    const num2 = Math.floor(Math.random() * 5) + 1
    const den2 = Math.floor(Math.random() * 5) + num2
    
    // Division: (a/b) ÷ (c/d) = (a/b) × (d/c)
    const numAnswer = num1 * den2
    const denAnswer = den1 * num2
    const [simplifiedNum, simplifiedDen] = simplifyFraction(numAnswer, denAnswer)
    const answer = `${simplifiedNum}/${simplifiedDen}`
    const questionText = `${num1}/${den1} ÷ ${num2}/${den2} = ?`
    
    const wrongAnswers = generateWrongFractionAnswers(answer, 3)
    const options = shuffleArray([answer, ...wrongAnswers])
    
    return {
      id: `fraction_${Date.now()}_${Math.random()}`,
      questionText,
      correctAnswer: answer,
      options,
      explanation: `To divide fractions, flip the second fraction and multiply: ${num1}/${den1} ÷ ${num2}/${den2} = ${num1}/${den1} × ${den2}/${num2} = ${numAnswer}/${denAnswer}${simplifiedDen !== denAnswer ? ` = ${answer}` : ''}`,
      topic: 'fractions',
    }
  }

  private generateMixedNumbers(): Question {
    const whole = Math.floor(Math.random() * 3) + 1
    const num = Math.floor(Math.random() * 3) + 1
    const den = Math.floor(Math.random() * 3) + num + 1
    
    const improperNum = whole * den + num
    const answer = `${improperNum}/${den}`
    const questionText = `Convert ${whole} ${num}/${den} to an improper fraction`
    
    const wrongAnswers = generateWrongFractionAnswers(answer, 3)
    const options = shuffleArray([answer, ...wrongAnswers])
    
    return {
      id: `fraction_${Date.now()}_${Math.random()}`,
      questionText,
      correctAnswer: answer,
      options,
      explanation: `Multiply whole number by denominator: ${whole} × ${den} = ${whole * den}, then add numerator: ${whole * den} + ${num} = ${improperNum}. Answer: ${improperNum}/${den}`,
      topic: 'fractions',
    }
  }

  private generateComplex(): Question {
    const num1 = Math.floor(Math.random() * 4) + 1
    const den1 = Math.floor(Math.random() * 4) + num1 + 1
    const num2 = Math.floor(Math.random() * 4) + 1
    const den2 = den1 // Same denominator
    
    const numAnswer = num1 + num2
    const [simplifiedNum, simplifiedDen] = simplifyFraction(numAnswer, den1)
    const answer = simplifiedDen === 1 ? `${simplifiedNum}` : `${simplifiedNum}/${simplifiedDen}`
    const questionText = `${num1}/${den1} + ${num2}/${den2} = ?`
    
    const wrongAnswers = generateWrongFractionAnswers(answer, 3)
    const options = shuffleArray([answer, ...wrongAnswers])
    
    return {
      id: `fraction_${Date.now()}_${Math.random()}`,
      questionText,
      correctAnswer: answer,
      options,
      explanation: `Add numerators: ${num1} + ${num2} = ${numAnswer}, keep denominator ${den1}. ${numAnswer}/${den1}${simplifiedDen !== den1 ? ` = ${answer}` : ''}`,
      topic: 'fractions',
    }
  }

  private generateAdvanced(isBoss: boolean): Question {
    if (isBoss) {
      const num1 = Math.floor(Math.random() * 6) + 2
      const den1 = Math.floor(Math.random() * 6) + num1 + 1
      const num2 = Math.floor(Math.random() * 6) + 2
      const den2 = Math.floor(Math.random() * 6) + num2 + 1
      
      // Find LCM for addition
      const lcm = (den1 * den2) / gcd(den1, den2)
      const numAnswer = (num1 * (lcm / den1)) + (num2 * (lcm / den2))
      const [simplifiedNum, simplifiedDen] = simplifyFraction(numAnswer, lcm)
      const answer = `${simplifiedNum}/${simplifiedDen}`
      const questionText = `${num1}/${den1} + ${num2}/${den2} = ?`
      
      const wrongAnswers = generateWrongFractionAnswers(answer, 3)
      const options = shuffleArray([answer, ...wrongAnswers])
      
      return {
        id: `fraction_${Date.now()}_${Math.random()}`,
        questionText,
        correctAnswer: answer,
        options,
        explanation: `Find common denominator: LCM of ${den1} and ${den2} is ${lcm}. Convert: ${num1}/${den1} = ${num1 * (lcm / den1)}/${lcm}, ${num2}/${den2} = ${num2 * (lcm / den2)}/${lcm}. Add: ${numAnswer}/${lcm}${simplifiedDen !== lcm ? ` = ${answer}` : ''}`,
        topic: 'fractions',
      }
    } else {
      return this.generateComplex()
    }
  }
}


