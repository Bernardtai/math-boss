import { AuthGuard } from '@/components/auth/AuthGuard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, Target, Clock, TrendingUp, Star, Award } from 'lucide-react'

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
        {/* Page indicator */}
        <div className="fixed top-20 left-4 z-40 bg-sky-500/10 text-sky-700 px-3 py-1 rounded-full text-xs font-medium">
          📊 Dashboard Page
        </div>
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-center mb-4">Welcome to Math Boss! 🎯</h1>
            <p className="text-center text-lg text-muted-foreground max-w-2xl mx-auto">
              Your navigation menu is now active! Use the menu bar above to explore all the features.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Start your math journey!</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Best Score</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Beat your high score!</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Keep it going!</p>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Guide */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Navigation Menu Features
              </CardTitle>
              <CardDescription>
                Click the menu items above to explore different sections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl mb-2">🏠</div>
                  <h3 className="font-semibold">Dashboard</h3>
                  <p className="text-sm text-muted-foreground">Overview and progress</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl mb-2">📚</div>
                  <h3 className="font-semibold">Lessons</h3>
                  <p className="text-sm text-muted-foreground">Island-based learning</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl mb-2">🏆</div>
                  <h3 className="font-semibold">Leaderboard</h3>
                  <p className="text-sm text-muted-foreground">Global rankings</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl mb-2">👤</div>
                  <h3 className="font-semibold">Profile</h3>
                  <p className="text-sm text-muted-foreground">Progress tracking</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coming Soon */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-500" />
                What's Coming Next
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">6 Math Islands (BODMAS, Grid Method, etc.)</span>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
                <Progress value={25} className="h-2" />
                <div className="flex items-center justify-between">
                  <span className="text-sm">Interactive Math Challenges</span>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
                <Progress value={10} className="h-2" />
                <div className="flex items-center justify-between">
                  <span className="text-sm">Global Leaderboards</span>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
                <Progress value={5} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
