export interface IslandTheme {
  bg: string
  border: string
  icon: string
  progress: string
}

const themes: Record<string, IslandTheme> = {
  bodmas: {
    bg: 'bg-gradient-to-br from-blue-400 to-blue-600',
    border: 'border-blue-300',
    icon: 'bg-blue-500',
    progress: 'bg-blue-200',
  },
  grid_method: {
    bg: 'bg-gradient-to-br from-green-400 to-green-600',
    border: 'border-green-300',
    icon: 'bg-green-500',
    progress: 'bg-green-200',
  },
  fractions: {
    bg: 'bg-gradient-to-br from-purple-400 to-purple-600',
    border: 'border-purple-300',
    icon: 'bg-purple-500',
    progress: 'bg-purple-200',
  },
  decimals: {
    bg: 'bg-gradient-to-br from-orange-400 to-orange-600',
    border: 'border-orange-300',
    icon: 'bg-orange-500',
    progress: 'bg-orange-200',
  },
  percentages: {
    bg: 'bg-gradient-to-br from-pink-400 to-pink-600',
    border: 'border-pink-300',
    icon: 'bg-pink-500',
    progress: 'bg-pink-200',
  },
  algebra: {
    bg: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
    border: 'border-indigo-300',
    icon: 'bg-indigo-500',
    progress: 'bg-indigo-200',
  },
}

/**
 * Get theme for an island/lesson
 */
export function getIslandTheme(lessonId: string): IslandTheme {
  return themes[lessonId] || themes.bodmas
}

/**
 * Get theme variation for a level within an island
 * This creates slight visual variations while maintaining the island theme
 */
export function getLevelThemeVariation(lessonId: string, levelIndex: number): IslandTheme {
  const baseTheme = getIslandTheme(lessonId)
  
  // Create slight variations based on level index
  // This keeps the same color family but adjusts brightness/saturation
  const variations = [
    { opacity: 1.0, brightness: 1.0 },
    { opacity: 0.95, brightness: 1.05 },
    { opacity: 0.9, brightness: 1.1 },
    { opacity: 0.85, brightness: 1.15 },
  ]
  
  const variation = variations[levelIndex % variations.length]
  
  return {
    ...baseTheme,
    bg: baseTheme.bg, // Keep base gradient
    border: baseTheme.border,
    icon: baseTheme.icon,
    progress: baseTheme.progress,
  }
}

