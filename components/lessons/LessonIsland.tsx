import { Card } from '@/components/ui/card'
import { Lock, Star, Trophy } from 'lucide-react'

interface LessonIslandProps {
  id: string
  name: string
  description: string
  icon: string
  colorTheme: string
  levelCount: number
  bossCount: number
  completedLevels: number
  isUnlocked: boolean
  onClick: () => void
}

export function LessonIsland({
  id,
  name,
  description,
  icon,
  colorTheme,
  levelCount,
  bossCount,
  completedLevels,
  isUnlocked,
  onClick,
}: LessonIslandProps) {
  const progressPercentage = (completedLevels / levelCount) * 100
  const isCompleted = completedLevels === levelCount

  const getThemeColors = (theme: string) => {
    const themes = {
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
    return themes[theme as keyof typeof themes] || themes.bodmas
  }

  const theme = getThemeColors(colorTheme)

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${
        !isUnlocked ? 'opacity-60' : ''
      } ${theme.bg} border-2 ${theme.border}`}
      onClick={isUnlocked ? onClick : undefined}
    >
      {/* Island Background Pattern */}
      <div className="absolute inset-0 bg-white/10">
        <div className="absolute -top-2 -right-2 w-20 h-20 bg-white/20 rounded-full"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/15 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/25 rounded-full"></div>
      </div>

      {/* Lock Overlay for Locked Islands */}
      {!isUnlocked && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <Lock className="w-12 h-12 text-white" />
        </div>
      )}

      <div className="relative z-10 p-6">
        {/* Island Icon and Title */}
        <div className="flex items-center mb-4">
          <div className={`w-12 h-12 ${theme.icon} rounded-full flex items-center justify-center mr-4 shadow-lg`}>
            <span className="text-white text-xl font-bold">{icon}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
            <p className="text-white/80 text-sm">{description}</p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/90 text-sm font-medium">Progress</span>
            <span className="text-white text-sm font-bold">
              {completedLevels}/{levelCount + bossCount}
            </span>
          </div>
          <div className={`w-full bg-white/30 rounded-full h-2`}>
            <div
              className={`h-2 rounded-full transition-all duration-500 ${theme.progress}`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Level Info */}
        <div className="flex justify-between items-center text-white/90 text-sm">
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1" />
            <span>{levelCount} Levels</span>
          </div>
          <div className="flex items-center">
            <Trophy className="w-4 h-4 mr-1" />
            <span>{bossCount} Boss{bossCount > 1 ? 'es' : ''}</span>
          </div>
        </div>

        {/* Completion Badge */}
        {isCompleted && (
          <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center">
            <Trophy className="w-3 h-3 mr-1" />
            Complete!
          </div>
        )}
      </div>
    </Card>
  )
}


