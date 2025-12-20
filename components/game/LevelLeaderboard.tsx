'use client'

import { useEffect, useState } from 'react'
import { getLevelLeaderboard, getUserLeaderboardRank } from '@/lib/db/queries.client'
import { LeaderboardEntry } from '@/lib/db/types'
import { formatTime, formatAccuracy } from '@/lib/game/leaderboard'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Trophy, Medal, Award, Loader2, AlertCircle } from 'lucide-react'

interface LevelLeaderboardProps {
  levelId: string
  userId: string | null
}

export function LevelLeaderboard({ levelId, userId }: LevelLeaderboardProps) {
  const [topEntries, setTopEntries] = useState<LeaderboardEntry[]>([])
  const [userEntry, setUserEntry] = useState<LeaderboardEntry | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadLeaderboard() {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch top 10 entries
        const top = await getLevelLeaderboard(levelId, 10)
        setTopEntries(top)

        // Fetch user's rank if userId is provided
        if (userId) {
          const userRank = await getUserLeaderboardRank(levelId, userId)
          setUserEntry(userRank)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load leaderboard')
        console.error('Error loading leaderboard:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadLeaderboard()
  }, [levelId, userId])

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Award className="h-5 w-5 text-orange-500" />
    return null
  }

  const getInitials = (name: string | null): string => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const isUserInTop10 = userEntry && topEntries.some(entry => entry.user_id === userEntry.user_id)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading leaderboard...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-red-500">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (topEntries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No rankings yet. Be the first to pass this level!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Leaderboard
        </CardTitle>
        <CardDescription>Top performers for this level</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Top 10 Entries */}
          {topEntries.map((entry) => {
            const isCurrentUser = userId && entry.user_id === userId
            return (
              <div
                key={entry.user_id}
                className={`flex items-center gap-4 p-3 rounded-lg border ${
                  isCurrentUser ? 'bg-primary/10 border-primary' : 'bg-background'
                }`}
              >
                {/* Rank */}
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(entry.rank) || (
                    <span className="text-sm font-semibold text-muted-foreground">#{entry.rank}</span>
                  )}
                </div>

                {/* Avatar */}
                <Avatar className="h-10 w-10">
                  {entry.avatar_url ? (
                    <AvatarImage src={entry.avatar_url} alt={entry.full_name || 'User'} />
                  ) : null}
                  <AvatarFallback>{getInitials(entry.full_name)}</AvatarFallback>
                </Avatar>

                {/* Username */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isCurrentUser ? 'text-primary' : ''}`}>
                    {entry.full_name || 'Anonymous'}
                    {isCurrentUser && <span className="ml-2 text-xs">(You)</span>}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-right">
                    <p className="text-muted-foreground text-xs">Time</p>
                    <p className="font-semibold">{formatTime(entry.time_taken)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground text-xs">Accuracy</p>
                    <p className="font-semibold">{formatAccuracy(entry.questions_correct, entry.questions_answered)}</p>
                  </div>
                </div>
              </div>
            )
          })}

          {/* User's Rank (if not in top 10) */}
          {userEntry && !isUserInTop10 && (
            <>
              <div className="border-t my-4"></div>
              <div className="flex items-center gap-4 p-3 rounded-lg border bg-primary/10 border-primary">
                {/* Rank */}
                <div className="flex items-center justify-center w-8">
                  <span className="text-sm font-semibold text-primary">#{userEntry.rank}</span>
                </div>

                {/* Avatar */}
                <Avatar className="h-10 w-10">
                  {userEntry.avatar_url ? (
                    <AvatarImage src={userEntry.avatar_url} alt={userEntry.full_name || 'User'} />
                  ) : null}
                  <AvatarFallback>{getInitials(userEntry.full_name)}</AvatarFallback>
                </Avatar>

                {/* Username */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-primary">
                    {userEntry.full_name || 'Anonymous'}
                    <span className="ml-2 text-xs">(You)</span>
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-right">
                    <p className="text-muted-foreground text-xs">Time</p>
                    <p className="font-semibold">{formatTime(userEntry.time_taken)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground text-xs">Accuracy</p>
                    <p className="font-semibold">{formatAccuracy(userEntry.questions_correct, userEntry.questions_answered)}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

