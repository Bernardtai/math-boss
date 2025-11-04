import { AuthGuard } from '@/components/auth/AuthGuard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, Lock, Star, Play, Target, Map, Compass, Sword, Shield } from 'lucide-react'

export default function LessonsPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Game-like header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-emerald-800/50 backdrop-blur-sm border border-emerald-600/30 rounded-full px-6 py-3 mb-4">
            <Compass className="h-6 w-6 text-emerald-300" />
            <span className="text-emerald-100 font-semibold">Island Explorer Mode</span>
            <Map className="h-6 w-6 text-emerald-300" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            🌴 Math Island Adventure
          </h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Embark on an epic journey across mathematical islands! Master each realm to unlock the next challenge.
          </p>
        </div>

        {/* Game stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-emerald-800/30 border-emerald-600/30 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Sword className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-sm text-emerald-200">Islands Conquered</div>
            </CardContent>
          </Card>
          <Card className="bg-emerald-800/30 border-emerald-600/30 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Shield className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-sm text-emerald-200">Boss Battles Won</div>
            </CardContent>
          </Card>
          <Card className="bg-emerald-800/30 border-emerald-600/30 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-sm text-emerald-200">Stars Collected</div>
            </CardContent>
          </Card>
          <Card className="bg-emerald-800/30 border-emerald-600/30 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">0%</div>
              <div className="text-sm text-emerald-200">Journey Progress</div>
            </CardContent>
          </Card>
        </div>
        {/* Island Map */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* BODMAS Island */}
            <Card className="relative overflow-hidden bg-emerald-800/40 border-emerald-600/40 backdrop-blur-sm hover:bg-emerald-700/50 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <BookOpen className="h-5 w-5 text-cyan-400" />
                    🏝️ BODMAS Island
                  </CardTitle>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Unlocked
                  </Badge>
                </div>
                <CardDescription className="text-emerald-200">Master the order of operations in this tropical paradise!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>0/7 levels</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full w-0"></div>
                  </div>
                  <Button className="w-full" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Start Learning
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Grid Method Island */}
            <Card className="relative overflow-hidden opacity-60">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-500" />
                    Grid Method Island
                  </CardTitle>
                  <Badge variant="outline">
                    <Lock className="h-3 w-3 mr-1" />
                    Locked
                  </Badge>
                </div>
                <CardDescription>Fast multiplication techniques</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Progress</span>
                    <span>0/3 levels</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-muted h-2 rounded-full w-0"></div>
                  </div>
                  <Button className="w-full" size="sm" disabled>
                    <Lock className="h-4 w-4 mr-2" />
                    Complete BODMAS First
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Fractions Island */}
            <Card className="relative overflow-hidden opacity-60">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Fractions Island
                  </CardTitle>
                  <Badge variant="outline">
                    <Lock className="h-3 w-3 mr-1" />
                    Locked
                  </Badge>
                </div>
                <CardDescription>Mixed operations with fractions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Progress</span>
                    <span>0/8 levels</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-muted h-2 rounded-full w-0"></div>
                  </div>
                  <Button className="w-full" size="sm" disabled>
                    <Lock className="h-4 w-4 mr-2" />
                    Complete Previous Islands
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Decimals Island */}
            <Card className="relative overflow-hidden opacity-60">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-red-500" />
                    Decimals Island
                  </CardTitle>
                  <Badge variant="outline">
                    <Lock className="h-3 w-3 mr-1" />
                    Locked
                  </Badge>
                </div>
                <CardDescription>All four operations with decimals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Progress</span>
                    <span>0/6 levels</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-muted h-2 rounded-full w-0"></div>
                  </div>
                  <Button className="w-full" size="sm" disabled>
                    <Lock className="h-4 w-4 mr-2" />
                    Complete Previous Islands
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Percentages Island */}
            <Card className="relative overflow-hidden opacity-60">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-500" />
                    Percentages Island
                  </CardTitle>
                  <Badge variant="outline">
                    <Lock className="h-3 w-3 mr-1" />
                    Locked
                  </Badge>
                </div>
                <CardDescription>Percentage calculations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Progress</span>
                    <span>0/6 levels</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-muted h-2 rounded-full w-0"></div>
                  </div>
                  <Button className="w-full" size="sm" disabled>
                    <Lock className="h-4 w-4 mr-2" />
                    Complete Previous Islands
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Algebra Island */}
            <Card className="relative overflow-hidden opacity-60">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-indigo-500" />
                    Algebra Island
                  </CardTitle>
                  <Badge variant="outline">
                    <Lock className="h-3 w-3 mr-1" />
                    Locked
                  </Badge>
                </div>
                <CardDescription>Basic algebraic expressions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Progress</span>
                    <span>0/6 levels</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-muted h-2 rounded-full w-0"></div>
                  </div>
                  <Button className="w-full" size="sm" disabled>
                    <Lock className="h-4 w-4 mr-2" />
                    Complete Previous Islands
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

        {/* Sign in prompt */}
        <div className="text-center mt-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                Sign in to unlock the full learning experience, track your progress, and compete on leaderboards!
              </p>
              <Button asChild>
                <a href="/login">Sign In to Start Learning</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
