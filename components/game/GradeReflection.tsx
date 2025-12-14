'use client'

import { GameState } from '@/lib/game/game-state'
import { checkPassFail, calculateScore, getGrade, getIncorrectQuestions } from '@/lib/game/game-logic'
import { TutorialDisplay } from './TutorialDisplay'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy, XCircle, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface GradeReflectionProps {
  gameState: GameState
  isBossLevel: boolean
  levelId: string
  lessonId: string
}

export function GradeReflection({ gameState, isBossLevel, levelId, lessonId }: GradeReflectionProps) {
  const router = useRouter()
  const passed = checkPassFail(gameState, isBossLevel)
  const score = calculateScore(gameState, isBossLevel)
  const grade = getGrade(gameState.correctAnswers, gameState.questions.length)
  const incorrectQuestions = getIncorrectQuestions(gameState)

  const handleRetry = () => {
    router.push(`/lessons/${lessonId}/${levelId}`)
  }

  const handleContinue = () => {
    // Navigate to next level or back to lesson
    router.push(`/lessons/${lessonId}`)
  }

  return (
    <div className="space-y-6">
      {/* Result Card */}
      <Card className={`border-2 ${passed ? 'border-green-500' : 'border-red-500'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {passed ? (
              <>
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span className="text-green-600">Level Complete!</span>
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-red-500" />
                <span className="text-red-600">Level Failed</span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Grade and Score */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Grade</p>
              <p className="text-3xl font-bold">{grade}</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Score</p>
              <p className="text-3xl font-bold">{score}</p>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-background rounded-lg border">
              <p className="text-2xl font-bold text-green-600">{gameState.correctAnswers}</p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div className="text-center p-3 bg-background rounded-lg border">
              <p className="text-2xl font-bold text-red-600">{gameState.wrongAnswers}</p>
              <p className="text-xs text-muted-foreground">Wrong</p>
            </div>
            <div className="text-center p-3 bg-background rounded-lg border">
              <p className="text-2xl font-bold text-blue-600">
                {Math.floor(gameState.timer / 60)}:{(gameState.timer % 60).toString().padStart(2, '0')}
              </p>
              <p className="text-xs text-muted-foreground">Time</p>
            </div>
          </div>

          {/* Pass/Fail Message */}
          <div className={`p-4 rounded-lg ${passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <p className={`font-semibold ${passed ? 'text-green-800' : 'text-red-800'}`}>
              {passed
                ? `Congratulations! You passed with ${gameState.correctAnswers} out of ${gameState.questions.length} correct.`
                : `You got ${gameState.wrongAnswers} wrong. You need ${isBossLevel ? '8 or fewer' : '4 or fewer'} wrong to pass. Please try again!`}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tutorial for Incorrect Questions */}
      {incorrectQuestions.length > 0 && (
        <TutorialDisplay
          questions={incorrectQuestions}
          answers={gameState.answers.map((a) => ({
            questionId: a.questionId,
            userAnswer: a.userAnswer,
            isCorrect: a.isCorrect,
          }))}
        />
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        {passed ? (
          <Button onClick={handleContinue} size="lg" className="flex-1">
            Continue
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        ) : (
          <Button onClick={handleRetry} size="lg" className="flex-1" variant="destructive">
            <RotateCcw className="mr-2 h-5 w-5" />
            Retry Level
          </Button>
        )}
      </div>
    </div>
  )
}

