'use client'

import { MissionOverlay } from './MissionOverlay'

interface PuzzleMissionProps {
  progress: number
  puzzlesSolved: number
  targetPuzzles: number
}

export function PuzzleMission({ progress, puzzlesSolved, targetPuzzles }: PuzzleMissionProps) {
  return (
    <MissionOverlay
      missionType="puzzle"
      progress={progress}
      objective={`Solve puzzles! Complete ${targetPuzzles} puzzles by answering correctly.`}
      currentValue={puzzlesSolved}
      targetValue={targetPuzzles}
    />
  )
}

