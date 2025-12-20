'use client'

import { MissionOverlay } from './MissionOverlay'

interface CollectMissionProps {
  progress: number
  collected: number
  targetCollect: number
}

export function CollectMission({ progress, collected, targetCollect }: CollectMissionProps) {
  return (
    <MissionOverlay
      missionType="collect"
      progress={progress}
      objective={`Collect treasures! Gather ${targetCollect} treasures by solving problems.`}
      currentValue={collected}
      targetValue={targetCollect}
    />
  )
}

