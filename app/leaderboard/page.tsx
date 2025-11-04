import { AuthGuard } from '@/components/auth/AuthGuard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, Medal, Award, Crown, Star, Globe, Users, Flame, Zap, Target } from 'lucide-react'

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
      {/* Page indicator */}
      <div className="fixed top-20 left-4 z-40 bg-purple-500/20 text-purple-100 px-3 py-1 rounded-full text-xs font-medium border border-purple-400/30">
        🏆 Championship Arena - Battle Rankings
      </div>

      {/* Epic background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-400/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-blue-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-purple-800/50 backdrop-blur-sm border border-purple-600/30 rounded-full px-6 py-3 mb-6">
            <Flame className="h-6 w-6 text-orange-400" />
            <span className="text-purple-100 font-semibold">Championship Arena</span>
            <Zap className="h-6 w-6 text-yellow-400" />
          </div>
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            ⚔️ Math Championship
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed">
            Battle against the world's finest mathematicians! Prove your mastery in epic boss challenges
            and claim your throne at the top of the rankings.
          </p>
        </div>

        {/* Leaderboard Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-muted p-1 rounded-lg">
            <Button variant="secondary" size="sm" className="bg-background">
              <Trophy className="h-4 w-4 mr-2" />
              Global Rankings
            </Button>
            <Button variant="ghost" size="sm">
              <Globe className="h-4 w-4 mr-2" />
              By Country
            </Button>
            <Button variant="ghost" size="sm">
              <Users className="h-4 w-4 mr-2" />
              By Age Group
            </Button>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* 2nd Place */}
            <Card className="relative order-1 md:order-2">
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-2">
                  <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <Medal className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
                <CardTitle className="text-lg">2nd Place</CardTitle>
                <CardDescription>Coming Soon</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-muted-foreground">---</div>
                <p className="text-sm text-muted-foreground">No scores yet</p>
              </CardContent>
            </Card>

            {/* 1st Place */}
            <Card className="relative order-2 md:order-1 border-yellow-200 bg-gradient-to-b from-yellow-50 to-yellow-100">
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-2">
                  <Crown className="h-12 w-12 text-yellow-500" />
                </div>
                <CardTitle className="text-xl text-yellow-700">1st Place</CardTitle>
                <CardDescription className="text-yellow-600">Champion</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-yellow-700">---</div>
                <p className="text-sm text-yellow-600">Be the first champion!</p>
              </CardContent>
            </Card>

            {/* 3rd Place */}
            <Card className="relative order-3 md:order-3">
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-2">
                  <div className="h-12 w-12 bg-orange-300 rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <CardTitle className="text-lg">3rd Place</CardTitle>
                <CardDescription>Coming Soon</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-muted-foreground">---</div>
                <p className="text-sm text-muted-foreground">No scores yet</p>
              </CardContent>
            </Card>
          </div>

          {/* Full Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Full Rankings
              </CardTitle>
              <CardDescription>
                Rankings are based on boss level performance only
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Empty State */}
                <div className="text-center py-12">
                  <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Rankings Yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Complete boss levels in the lessons to appear on the leaderboard and compete with students worldwide!
                  </p>
                  <Button asChild>
                    <a href="/lessons">Start Learning</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Players</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Worldwide participants</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Boss Levels</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Across all 6 islands</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Score</CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">---</div>
                <p className="text-xs text-muted-foreground">Waiting for champions</p>
              </CardContent>
            </Card>
          </div>

        {/* Sign in prompt */}
        <div className="text-center mt-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                Sign in to appear on leaderboards, track your ranking, and compete with students worldwide!
              </p>
              <Button asChild>
                <a href="/login">Sign In to Compete</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
