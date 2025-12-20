'use client'

import { Level, UserProgress } from '@/lib/db/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lock, Play, Trophy, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface LevelCardProps {
  level: Level
  isUnlocked: boolean
  userProgress?: UserProgress | null
  isBossLevel: boolean
  theme: {
    bg: string
    border: string
    icon: string
    progress: string
  }
}

export function LevelCard({
  level,
  isUnlocked,
  userProgress,
  isBossLevel,
  theme,
}: LevelCardProps) {
  const router = useRouter()
  const isCompleted = userProgress?.passed ?? false
  const progress = userProgress
    ? Math.round((userProgress.questions_correct / level.question_count) * 100)
    : 0

  const handleClick = () => {
    if (isUnlocked) {
      router.push(`/lessons/${level.lesson_id}/${level.id}`)
    }
  }

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-300 cursor-pointer',
        isBossLevel ? 'scale-105 border-2' : 'border',
        isUnlocked
          ? `${theme.bg} ${theme.border} hover:scale-105 hover:shadow-xl`
          : 'opacity-60 bg-muted border-muted',
        isBossLevel && isUnlocked && 'ring-2 ring-yellow-400'
      )}
      onClick={handleClick}
    >
      {/* Lock Overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <Lock className="w-12 h-12 text-white" />
        </div>
      )}

      {/* Boss Level Badge */}
      {isBossLevel && (
        <div className="absolute top-2 right-2 z-20">
          <div className="bg-yellow-500 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            BOSS
          </div>
        </div>
      )}

      {/* Completion Badge */}
      {isCompleted && (
        <div className="absolute top-2 left-2 z-20">
          <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Complete
          </div>
        </div>
      )}

      <CardHeader className="pb-3">
        <CardTitle className={cn('text-lg', isUnlocked ? 'text-white' : 'text-muted-foreground')}>
          {level.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {level.description && (
          <p className={cn('text-sm', isUnlocked ? 'text-white/80' : 'text-muted-foreground')}>
            {level.description}
          </p>
        )}

        {/* Progress Bar */}
        {userProgress && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className={isUnlocked ? 'text-white/90' : 'text-muted-foreground'}>
                Progress
              </span>
              <span className={isUnlocked ? 'text-white' : 'text-muted-foreground'}>
                {userProgress.questions_correct}/{level.question_count}
              </span>
            </div>
            <div className={cn('w-full rounded-full h-2', isUnlocked ? 'bg-white/30' : 'bg-muted')}>
              <div
                className={cn('h-2 rounded-full transition-all', theme.progress)}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Level Info */}
        <div className="flex justify-between items-center text-xs">
          <span className={isUnlocked ? 'text-white/90' : 'text-muted-foreground'}>
            {level.question_count} questions
          </span>
          {isBossLevel && (
            <span className={isUnlocked ? 'text-yellow-300' : 'text-muted-foreground'}>
              Boss Level
            </span>
          )}
        </div>

        {/* Action Button */}
        <Button
          className={cn(
            'w-full',
            isUnlocked
              ? 'bg-white text-primary hover:bg-white/90'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          )}
          disabled={!isUnlocked}
          onClick={(e) => {
            e.stopPropagation()
            handleClick()
          }}
        >
          {isUnlocked ? (
            <>
              <Play className="mr-2 h-4 w-4" />
              {isCompleted ? 'Play Again' : 'Start Level'}
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Locked
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

