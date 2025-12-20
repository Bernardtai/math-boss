'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle2, XCircle } from 'lucide-react'

interface MultipleChoiceOptionsProps {
  options: (string | number)[]
  correctAnswer: string | number
  onSelect: (answer: string | number) => void
  selectedAnswer: string | number | null
  showResult: boolean
  disabled?: boolean
}

export function MultipleChoiceOptions({
  options,
  correctAnswer,
  onSelect,
  selectedAnswer,
  showResult,
  disabled = false,
}: MultipleChoiceOptionsProps) {
  const handleClick = (option: string | number) => {
    if (!disabled && !showResult) {
      onSelect(option)
    }
  }

  const getOptionStyle = (option: string | number) => {
    if (!showResult) {
      return selectedAnswer === option
        ? 'bg-primary text-primary-foreground border-primary'
        : 'bg-background hover:bg-muted border-border'
    }

    // Show result
    if (option === correctAnswer) {
      return 'bg-green-500 text-white border-green-600'
    }
    if (option === selectedAnswer && option !== correctAnswer) {
      return 'bg-red-500 text-white border-red-600'
    }
    return 'bg-muted text-muted-foreground border-border opacity-60'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {options.map((option, index) => {
        const isSelected = selectedAnswer === option
        const isCorrect = option === correctAnswer
        const showIcon = showResult && (isSelected || isCorrect)

        return (
          <Card
            key={index}
            className={`cursor-pointer transition-all border-2 ${getOptionStyle(option)} ${
              disabled || showResult ? 'cursor-not-allowed' : 'hover:scale-105'
            }`}
            onClick={() => handleClick(option)}
          >
            <div className="p-4 flex items-center justify-between">
              <span className="text-lg font-semibold">{String(option)}</span>
              {showIcon && (
                <div>
                  {isCorrect ? (
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  ) : isSelected ? (
                    <XCircle className="h-6 w-6 text-white" />
                  ) : null}
                </div>
              )}
            </div>
          </Card>
        )
      })}
    </div>
  )
}

