'use client'

import { MissionOverlay } from './MissionOverlay'

interface HitMissionProps {
  progress: number
  hits: number
  targetHits: number
}

export function HitMission({ progress, hits, targetHits }: HitMissionProps) {
  return (
    <MissionOverlay
      missionType="hit"
      progress={progress}
      objective={`Defeat the monster! Hit it ${targetHits} times with correct answers.`}
      currentValue={hits}
      targetValue={targetHits}
    />
  )
}

