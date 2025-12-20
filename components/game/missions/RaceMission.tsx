'use client'

import { MissionOverlay } from './MissionOverlay'

interface RaceMissionProps {
  progress: number
  correctAnswers: number
  totalQuestions: number
  timeRemaining?: number
}

export function RaceMission({
  progress,
  correctAnswers,
  totalQuestions,
  timeRemaining,
}: RaceMissionProps) {
  return (
    <MissionOverlay
      missionType="race"
      progress={progress}
      objective={`Race to the finish! Complete ${totalQuestions} questions quickly!`}
      currentValue={correctAnswers}
      targetValue={totalQuestions}
    />
  )
}

