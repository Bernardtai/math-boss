import { Question } from '@/lib/math-engine/types'

export interface Answer {
  questionId: string
  userAnswer: string | number
  isCorrect: boolean
  timeTaken: number // in seconds
}

export interface GameState {
  levelId: string
  questions: Question[]
  currentQuestionIndex: number
  answers: Answer[]
  timer: number // in seconds
  startTime: number | null
  isStarted: boolean
  isCompleted: boolean
  wrongAnswers: number
  correctAnswers: number
}

export function createInitialGameState(levelId: string, questions: Question[]): GameState {
  return {
    levelId,
    questions,
    currentQuestionIndex: 0,
    answers: [],
    timer: 0,
    startTime: null,
    isStarted: false,
    isCompleted: false,
    wrongAnswers: 0,
    correctAnswers: 0,
  }
}

export function startGame(state: GameState): GameState {
  return {
    ...state,
    isStarted: true,
    startTime: Date.now(),
    timer: 0,
  }
}

export function submitAnswer(
  state: GameState,
  userAnswer: string | number,
  isCorrect: boolean,
  timeTaken: number
): GameState {
  const currentQuestion = state.questions[state.currentQuestionIndex]
  const newAnswer: Answer = {
    questionId: currentQuestion.id,
    userAnswer,
    isCorrect,
    timeTaken,
  }

  const newAnswers = [...state.answers, newAnswer]
  const newWrongAnswers = state.wrongAnswers + (isCorrect ? 0 : 1)
  const newCorrectAnswers = state.correctAnswers + (isCorrect ? 1 : 0)
  const newTimer = state.timer + (isCorrect ? 0 : 5) // +5 seconds penalty for wrong answer

  const isLastQuestion = state.currentQuestionIndex === state.questions.length - 1

  return {
    ...state,
    answers: newAnswers,
    wrongAnswers: newWrongAnswers,
    correctAnswers: newCorrectAnswers,
    timer: newTimer,
    currentQuestionIndex: isLastQuestion ? state.currentQuestionIndex : state.currentQuestionIndex + 1,
    isCompleted: isLastQuestion,
  }
}

export function updateTimer(state: GameState, elapsedSeconds: number): GameState {
  if (!state.isStarted || state.isCompleted) {
    return state
  }

  return {
    ...state,
    timer: elapsedSeconds,
  }
}

export function getCurrentQuestion(state: GameState): Question | null {
  if (state.currentQuestionIndex >= state.questions.length) {
    return null
  }
  return state.questions[state.currentQuestionIndex]
}

export function getProgress(state: GameState): { current: number; total: number; percentage: number } {
  return {
    current: state.currentQuestionIndex + 1,
    total: state.questions.length,
    percentage: ((state.currentQuestionIndex + 1) / state.questions.length) * 100,
  }
}

