'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AvatarRenderer } from './AvatarRenderer'
import { AvatarCustomization } from '@/lib/db/types'
import { ArrowRight } from 'lucide-react'

interface StoryDisplayProps {
  storyText: string
  avatarCustomization?: AvatarCustomization | null
  onContinue?: () => void
  showContinueButton?: boolean
  animated?: boolean
}

export function StoryDisplay({
  storyText,
  avatarCustomization,
  onContinue,
  showContinueButton = true,
  animated = true,
}: StoryDisplayProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!animated) {
      setDisplayedText(storyText)
      setIsComplete(true)
      return
    }

    // Animated text reveal
    setDisplayedText('')
    setIsComplete(false)
    let currentIndex = 0

    const interval = setInterval(() => {
      if (currentIndex < storyText.length) {
        setDisplayedText(storyText.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        setIsComplete(true)
        clearInterval(interval)
      }
    }, 30) // 30ms per character

    return () => clearInterval(interval)
  }, [storyText, animated])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6 space-y-6">
        {/* Avatar and Story */}
        <div className="flex gap-4 items-start">
          <AvatarRenderer
            customization={avatarCustomization}
            size="lg"
            pose="thinking"
            className="flex-shrink-0"
          />
          <div className="flex-1 space-y-4">
            <div className="prose prose-sm max-w-none">
              <p className="text-base md:text-lg leading-relaxed text-foreground whitespace-pre-wrap">
                {displayedText}
                {!isComplete && animated && (
                  <span className="animate-pulse">|</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        {showContinueButton && isComplete && onContinue && (
          <div className="flex justify-end pt-4">
            <Button onClick={onContinue} size="lg">
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

