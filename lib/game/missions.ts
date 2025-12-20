/**
 * Mission System
 * Handles different mission types and their mechanics
 */

export type MissionType = 'escape' | 'hit' | 'collect' | 'race' | 'puzzle' | 'defend'

export interface MissionProgress {
  type: MissionType
  completed: boolean
  progress: number // 0-100
  metadata: Record<string, any>
}

export interface MissionConfig {
  type: MissionType
  objective: string
  targetValue?: number
  timeLimit?: number
}

/**
 * Mission type definitions and handlers
 */
export const MissionHandlers = {
  escape: {
    name: 'Escape Mission',
    description: 'Escape from the monster by answering questions correctly!',
    calculateProgress: (correct: number, total: number, timeTaken: number, timeLimit?: number) => {
      const accuracy = (correct / total) * 100
      const timeBonus = timeLimit ? Math.max(0, ((timeLimit - timeTaken) / timeLimit) * 100) : 0
      return Math.min(100, accuracy * 0.7 + timeBonus * 0.3)
    },
    isComplete: (correct: number, total: number, minCorrect: number = 6) => {
      return correct >= minCorrect
    },
  },

  hit: {
    name: 'Attack Mission',
    description: 'Defeat the monster by hitting it with correct answers!',
    calculateProgress: (correct: number, total: number) => {
      return (correct / total) * 100
    },
    isComplete: (correct: number, total: number, minCorrect: number = 6) => {
      return correct >= minCorrect
    },
  },

  collect: {
    name: 'Collection Mission',
    description: 'Collect treasures by solving math problems!',
    calculateProgress: (correct: number, total: number) => {
      return (correct / total) * 100
    },
    isComplete: (correct: number, total: number, minCorrect: number = 6) => {
      return correct >= minCorrect
    },
  },

  race: {
    name: 'Race Mission',
    description: 'Race against time to solve problems quickly!',
    calculateProgress: (correct: number, total: number, timeTaken: number, timeLimit?: number) => {
      const accuracy = (correct / total) * 100
      const speedBonus = timeLimit ? Math.max(0, ((timeLimit - timeTaken) / timeLimit) * 100) : 0
      return Math.min(100, accuracy * 0.5 + speedBonus * 0.5)
    },
    isComplete: (correct: number, total: number, minCorrect: number = 6) => {
      return correct >= minCorrect
    },
  },

  puzzle: {
    name: 'Puzzle Mission',
    description: 'Solve puzzles by answering math questions correctly!',
    calculateProgress: (correct: number, total: number) => {
      return (correct / total) * 100
    },
    isComplete: (correct: number, total: number, minCorrect: number = 6) => {
      return correct >= minCorrect
    },
  },

  defend: {
    name: 'Defense Mission',
    description: 'Defend your position by solving problems!',
    calculateProgress: (correct: number, total: number, wrong: number) => {
      const accuracy = (correct / total) * 100
      const defensePenalty = Math.max(0, 100 - wrong * 10)
      return Math.min(100, accuracy * 0.6 + defensePenalty * 0.4)
    },
    isComplete: (correct: number, total: number, maxWrong: number = 4) => {
      return total - correct <= maxWrong
    },
  },
}

/**
 * Get mission handler for a mission type
 */
export function getMissionHandler(type: MissionType) {
  return MissionHandlers[type] || MissionHandlers.escape
}

/**
 * Calculate mission progress
 */
export function calculateMissionProgress(
  missionType: MissionType,
  correct: number,
  total: number,
  wrong: number = 0,
  timeTaken: number = 0,
  timeLimit?: number
): number {
  const handler = getMissionHandler(missionType)
  return handler.calculateProgress(correct, total, timeTaken, timeLimit)
}

/**
 * Check if mission is complete
 */
export function isMissionComplete(
  missionType: MissionType,
  correct: number,
  total: number,
  wrong: number = 0,
  minCorrect: number = 6,
  maxWrong: number = 4
): boolean {
  const handler = getMissionHandler(missionType)
  return handler.isComplete(correct, total, minCorrect)
}

