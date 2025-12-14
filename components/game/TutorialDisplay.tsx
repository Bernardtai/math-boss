'use client'

import { Question } from '@/lib/math-engine/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'

interface TutorialDisplayProps {
  questions: Question[]
  answers: { questionId: string; userAnswer: string | number; isCorrect: boolean }[]
}

export function TutorialDisplay({ questions, answers }: TutorialDisplayProps) {
  const incorrectQuestions = questions.filter((q) => {
    const answer = answers.find((a) => a.questionId === q.id)
    return answer && !answer.isCorrect
  })

  if (incorrectQuestions.length === 0) {
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Tutorial: How to Solve These Questions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {incorrectQuestions.map((question, index) => {
          const userAnswer = answers.find((a) => a.questionId === question.id)?.userAnswer
          return (
            <Card key={question.id} className="bg-muted/50">
              <CardContent className="p-4 space-y-3">
                <div>
                  <p className="font-semibold text-sm text-muted-foreground mb-1">
                    Question {index + 1}
                  </p>
                  <p className="text-lg font-medium">{question.questionText}</p>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-semibold text-red-600">
                      Your answer: {String(userAnswer)}
                    </p>
                    <p className="text-sm font-semibold text-green-600">
                      Correct answer: {String(question.correctAnswer)}
                    </p>
                  </div>
                  <div className="bg-background p-3 rounded-lg border">
                    <p className="text-sm font-semibold mb-2">Solution:</p>
                    <p className="text-sm text-muted-foreground">{question.explanation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </CardContent>
    </Card>
  )
}

