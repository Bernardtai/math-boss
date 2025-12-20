'use client'

import { MissionOverlay } from './MissionOverlay'

interface DefendMissionProps {
  progress: number
  health: number
  maxHealth: number
  attacksBlocked: number
}

export function DefendMission({
  progress,
  health,
  maxHealth,
  attacksBlocked,
}: DefendMissionProps) {
  return (
    <MissionOverlay
      missionType="defend"
      progress={progress}
      objective={`Defend your position! Keep your health above 0 by answering correctly.`}
      currentValue={health}
      targetValue={maxHealth}
    />
  )
}

