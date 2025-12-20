export interface Question {
  id: string
  questionText: string
  correctAnswer: number | string
  options: (number | string)[]
  explanation: string
  topic: string
}

export interface QuestionGenerator {
  generateQuestion(level: number, isBoss: boolean): Question
}

export interface MultipleChoiceOptions {
  correct: number | string
  wrong: (number | string)[]
}

