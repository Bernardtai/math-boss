import { AuthGuard } from '@/components/auth/AuthGuard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Trophy, Target, Clock, TrendingUp, Star, Award, Calendar, MapPin, Edit, Rocket, Zap, Shield, Cpu } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 pt-20">
      {/* Page indicator */}
      <div className="fixed top-20 left-4 z-40 bg-pink-500/20 text-pink-100 px-3 py-1 rounded-full text-xs font-medium border border-pink-400/30">
        🚀 Command Center - Personal Hub
      </div>

      {/* Futuristic background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-purple-400/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-pink-400/10 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Command Center Header */}
        <div className="mb-8">
            <Card className="bg-purple-800/30 border-purple-600/30 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-3 bg-pink-800/50 backdrop-blur-sm border border-pink-600/30 rounded-full px-6 py-3 mb-4">
                    <Cpu className="h-6 w-6 text-cyan-400" />
                    <span className="text-pink-100 font-semibold">Personal Command Center</span>
                    <Rocket className="h-6 w-6 text-purple-400" />
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-2">Captain's Log</h1>
                  <p className="text-purple-200">Monitor your mathematical conquests and plan your next mission</p>
                </div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <Avatar className="h-24 w-24 ring-4 ring-purple-400/30">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="text-2xl bg-purple-700 text-white">👨‍🚀</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-white mb-2">Captain Demo</h1>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-purple-200 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-cyan-400" />
                        <span>Earth Command</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-pink-400" />
                        <span>Age: 12</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span>Mission Active</span>
                      </div>
                    </div>
                    <p className="text-purple-200 mb-4 max-w-md">
                      Elite mathematician mastering the Asian method! Commanding operations across BODMAS, fractions, and algebra galaxies.
                    </p>
                    <Button variant="outline" size="sm" className="border-purple-400 text-purple-200 hover:bg-purple-700/50">
                      <Edit className="h-4 w-4 mr-2" />
                      Update Mission Log
                    </Button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Badge variant="secondary" className="text-center">
                      🏆 Beginner
                    </Badge>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">0</div>
                      <div className="text-xs text-muted-foreground">Total Points</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Start your journey!</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Best Score</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Beat your record!</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Studied</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0m</div>
                <p className="text-xs text-muted-foreground">Learning time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Consecutive days</p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Island Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Island Progress
                </CardTitle>
                <CardDescription>Your journey through the math islands</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'BODMAS Island', progress: 0, total: 7, color: 'blue' },
                    { name: 'Grid Method Island', progress: 0, total: 3, color: 'purple' },
                    { name: 'Fractions Island', progress: 0, total: 8, color: 'yellow' },
                    { name: 'Decimals Island', progress: 0, total: 6, color: 'red' },
                    { name: 'Percentages Island', progress: 0, total: 6, color: 'green' },
                    { name: 'Algebra Island', progress: 0, total: 6, color: 'indigo' },
                  ].map((island, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{island.name}</span>
                        <span className="text-muted-foreground">{island.progress}/{island.total}</span>
                      </div>
                      <Progress value={(island.progress / island.total) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Achievements
                </CardTitle>
                <CardDescription>Your math learning milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* No achievements yet */}
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No Achievements Yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Complete lessons and reach milestones to earn badges!
                    </p>
                    <Button size="sm" asChild>
                      <a href="/lessons">Start Learning</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-500" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest learning progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* No activity yet */}
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Activity Yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your learning journey starts here! Complete your first lesson to see activity updates.
                  </p>
                  <Button asChild>
                    <a href="/lessons">Begin Learning</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

        {/* Sign in prompt */}
        <div className="text-center mt-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                Sign in to create your personalized profile, track your learning progress, and earn achievements!
              </p>
              <Button asChild>
                <a href="/login">Sign In to Get Started</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
