'use client'

import { MissionType } from '@/lib/game/missions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface MissionOverlayProps {
  missionType: MissionType
  progress: number // 0-100
  objective: string
  currentValue?: number
  targetValue?: number
}

const missionIcons = {
  escape: '🏃',
  hit: '⚔️',
  collect: '💎',
  race: '🏁',
  puzzle: '🧩',
  defend: '🛡️',
}

const missionColors = {
  escape: 'bg-blue-500',
  hit: 'bg-red-500',
  collect: 'bg-yellow-500',
  race: 'bg-green-500',
  puzzle: 'bg-purple-500',
  defend: 'bg-orange-500',
}

export function MissionOverlay({
  missionType,
  progress,
  objective,
  currentValue,
  targetValue,
}: MissionOverlayProps) {
  return (
    <Card className="fixed top-4 right-4 z-50 w-64 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <span className="text-xl">{missionIcons[missionType]}</span>
          <span className="capitalize">{missionType} Mission</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs text-muted-foreground">{objective}</p>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-semibold">{Math.round(progress)}%</span>
        </div>
        {currentValue !== undefined && targetValue !== undefined && (
          <div className="flex justify-between text-xs">
            <Badge variant="outline">
              {currentValue} / {targetValue}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

