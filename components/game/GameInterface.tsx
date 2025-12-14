'use client'

import { useState, useEffect } from 'react'
import { QuestionDisplay } from './QuestionDisplay'
import { MultipleChoiceOptions } from './MultipleChoiceOptions'
import { Timer } from './Timer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Play, ArrowRight } from 'lucide-react'
import { GameState, startGame, submitAnswer, updateTimer, getCurrentQuestion, getProgress } from '@/lib/game/game-state'
import { validateAnswer } from '@/lib/game/game-logic'
import { Question } from '@/lib/math-engine/types'

interface GameInterfaceProps {
  questions: Question[]
  levelId: string
  isBossLevel: boolean
  onComplete: (state: GameState) => void
}

export function GameInterface({ questions, levelId, isBossLevel, onComplete }: GameInterfaceProps) {
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialState = {
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
    return initialState
  })

  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null)

  const currentQuestion = getCurrentQuestion(gameState)
  const progress = getProgress(gameState)

  // Handle timer updates
  const handleTimeUpdate = (time: number) => {
    setGameState((prev) => updateTimer(prev, time))
  }

  // Handle game start
  const handleStart = () => {
    const newState = startGame(gameState)
    setGameState(newState)
    setQuestionStartTime(Date.now())
  }

  // Handle answer selection
  const handleAnswerSelect = (answer: string | number) => {
    if (showResult || !currentQuestion) return
    setSelectedAnswer(answer)
  }

  // Handle answer submission
  const handleSubmit = () => {
    if (!currentQuestion || selectedAnswer === null) return

    const timeTaken = questionStartTime ? Math.floor((Date.now() - questionStartTime) / 1000) : 0
    const isCorrect = validateAnswer(currentQuestion, selectedAnswer)

    const newState = submitAnswer(gameState, selectedAnswer, isCorrect, timeTaken)
    setGameState(newState)

    // Show result briefly
    setShowResult(true)

    // Move to next question or complete
    setTimeout(() => {
      if (newState.isCompleted) {
        onComplete(newState)
      } else {
        setSelectedAnswer(null)
        setShowResult(false)
        setQuestionStartTime(Date.now())
      }
    }, 2000)
  }

  // Pre-game screen
  if (!gameState.isStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-6">
            <h2 className="text-2xl font-bold">Ready to Start?</h2>
            <p className="text-muted-foreground">
              {isBossLevel
                ? `Boss Level: ${questions.length} questions. Pass if you get 8 or fewer wrong.`
                : `Regular Level: ${questions.length} questions. Pass if you get 4 or fewer wrong.`}
            </p>
            <p className="text-sm text-muted-foreground">
              Wrong answers add +5 seconds to your timer!
            </p>
            <Timer initialTime={0} isRunning={false} />
            <Button onClick={handleStart} size="lg" className="w-full">
              <Play className="mr-2 h-5 w-5" />
              Start Game
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Game screen
  if (!gameState.isCompleted && currentQuestion) {
    return (
      <div className="space-y-6">
        {/* Timer and Progress */}
        <div className="flex items-center justify-between gap-4">
          <Timer
            initialTime={gameState.timer}
            isRunning={gameState.isStarted && !gameState.isCompleted}
            onTimeUpdate={handleTimeUpdate}
          />
          <div className="flex-1">
            <Progress value={progress.percentage} className="h-2" />
            <p className="text-sm text-muted-foreground mt-1 text-center">
              {progress.current} / {progress.total}
            </p>
          </div>
        </div>

        {/* Question */}
        <QuestionDisplay
          question={currentQuestion}
          questionNumber={progress.current}
          totalQuestions={progress.total}
        />

        {/* Answer Options */}
        <MultipleChoiceOptions
          options={currentQuestion.options}
          correctAnswer={currentQuestion.correctAnswer}
          onSelect={handleAnswerSelect}
          selectedAnswer={selectedAnswer}
          showResult={showResult}
          disabled={showResult}
        />

        {/* Submit Button */}
        {!showResult && (
          <Button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            size="lg"
            className="w-full"
          >
            Submit Answer
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        )}

        {/* Feedback */}
        {showResult && (
          <Card className={`border-2 ${selectedAnswer === currentQuestion.correctAnswer ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
            <CardContent className="p-4">
              <p className={`font-semibold ${selectedAnswer === currentQuestion.correctAnswer ? 'text-green-700' : 'text-red-700'}`}>
                {selectedAnswer === currentQuestion.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
              </p>
              {selectedAnswer !== currentQuestion.correctAnswer && (
                <p className="text-sm text-muted-foreground mt-2">
                  The correct answer is: {String(currentQuestion.correctAnswer)}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return null
}

