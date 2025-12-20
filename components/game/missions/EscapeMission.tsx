'use client'

import { MissionOverlay } from './MissionOverlay'
import { MissionType } from '@/lib/game/missions'

interface EscapeMissionProps {
  progress: number
  correctAnswers: number
  totalQuestions: number
  timeRemaining?: number
}

export function EscapeMission({
  progress,
  correctAnswers,
  totalQuestions,
  timeRemaining,
}: EscapeMissionProps) {
  return (
    <MissionOverlay
      missionType="escape"
      progress={progress}
      objective={`Escape the monster! Answer ${totalQuestions} questions correctly.`}
      currentValue={correctAnswers}
      targetValue={totalQuestions}
    />
  )
}

