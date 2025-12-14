'use client'

import { Question } from '@/lib/math-engine/types'
import { Card, CardContent } from '@/components/ui/card'

interface QuestionDisplayProps {
  question: Question
  questionNumber: number
  totalQuestions: number
}

export function QuestionDisplay({ question, questionNumber, totalQuestions }: QuestionDisplayProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="mb-4">
          <span className="text-sm text-muted-foreground">
            Question {questionNumber} of {totalQuestions}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-4">{question.questionText}</h2>
      </CardContent>
    </Card>
  )
}

