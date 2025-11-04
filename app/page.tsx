'use client'

// Temporarily disabled for UI/UX development
// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Target, Trophy, Users, BookOpen, Play, BarChart3, Globe, TrendingUp, Award } from 'lucide-react'

export default function HomePage() {
  // Temporarily disable auth redirect to show landing page
  // const [user, setUser] = useState<any>(null)
  // const [loading, setLoading] = useState(true)
  // const router = useRouter()
  // const supabase = createClient()

  // useEffect(() => {
  //   const getUser = async () => {
  //     try {
  //       // Only check auth if Supabase is configured
  //       if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  //         const { data: { user } } = await supabase.auth.getUser()
  //         setUser(user)

  //         if (user) {
  //           router.push('/dashboard')
  //         }
  //       }
  //     } catch (error) {
  //       console.warn('Supabase not configured, showing landing page')
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   getUser()
  // }, [supabase.auth, router])

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center pt-16">
  //       <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  //     </div>
  //   )
  // }

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      {/* Page indicator */}
      <div className="fixed top-20 left-4 z-40 bg-blue-500/10 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
        🏠 Home Page - Welcome Landing
      </div>
      {/* Hero Section */}
      <section className="relative py-20 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Master Math with the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Asian Method
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-muted-foreground">
              A web application that shares the "Asian Way" of daily math drills to help students worldwide improve their mathematical skills through gamified learning experiences.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" onClick={() => window.location.href = '/dashboard'}>
                🎯 View Navigation Demo
              </Button>
              <Button size="lg" variant="outline" onClick={() => scrollToSection('how-to-use')}>
                How to Use
              </Button>
              <Button variant="outline" size="lg" onClick={() => scrollToSection('about')}>
                About Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Project Introduction & Target Market */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              🎯 Project Overview
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">The Problem</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Western parents believe Asian kids are naturally better at math (PISA 2022 ranks Asian countries in top 5, US at #28),
                yet existing programs like Kumon show only <strong>20% improvement</strong> after 6 months despite $2,000-$3,000 annual costs.
              </p>
              <h3 className="text-2xl font-semibold text-foreground mb-4">The Solution</h3>
              <p className="text-lg text-muted-foreground">
                <strong>Math Boss</strong> transforms traditional Asian math practice methods into engaging, short challenges with global leaderboards,
                making repetitive practice fun and trackable.
              </p>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Target className="h-8 w-8 text-red-500" />
                  <CardTitle>Target Audience</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Primary:</strong> Students aged 8-16 seeking math improvement</li>
                    <li>• <strong>Secondary:</strong> Parents looking for effective, engaging math practice</li>
                    <li>• <strong>Global:</strong> Anyone wanting to learn the "Asian method" of math mastery</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Globe className="h-8 w-8 text-blue-500" />
                  <CardTitle>Key Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Proven Asian Methods:</strong> Time-tested techniques that work</li>
                    <li>• <strong>Gamified Learning:</strong> Make practice enjoyable</li>
                    <li>• <strong>Global Competition:</strong> Compete worldwide</li>
                    <li>• <strong>Progress Tracking:</strong> Visual improvement charts</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section id="how-to-use" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              📱 How to Use This Website
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Our simple 4-page structure makes learning math with the Asian method easy and accessible
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                    1
                  </div>
                  <div>
                    <CardTitle>Main Page</CardTitle>
                    <CardDescription>You're here! Project introduction and getting started</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-500 text-white text-xl font-bold">
                    2
                  </div>
                  <div>
                    <CardTitle>Lessons Page</CardTitle>
                    <CardDescription>Visual island-based lesson selection with progress tracking</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Unlock islands based on performance</li>
                  <li>• Regular levels + Boss challenges</li>
                  <li>• Locked/unlocked lesson indicators</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 flex items-center justify-center rounded-full bg-green-500 text-white text-xl font-bold">
                    3
                  </div>
                  <div>
                    <CardTitle>Leaderboard Page</CardTitle>
                    <CardDescription>Global rankings and country-based performance display</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Global rankings by lesson</li>
                  <li>• User names, ages, achievement dates</li>
                  <li>• Country-based performance</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 flex items-center justify-center rounded-full bg-purple-500 text-white text-xl font-bold">
                    4
                  </div>
                  <div>
                    <CardTitle>Profile/Progress Page</CardTitle>
                    <CardDescription>Detailed progress charts and performance analytics</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• User profile management</li>
                  <li>• Detailed progress charts</li>
                  <li>• Performance analytics</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 p-6 bg-primary/5 rounded-lg border border-primary/20">
              <Award className="h-8 w-8 text-primary" />
              <div className="text-left">
                <h3 className="font-semibold text-foreground">Getting Started</h3>
                <p className="text-sm text-muted-foreground">Sign up with Google, choose your first island, and start your math mastery journey!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              🌟 Key Features
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <BookOpen className="h-8 w-8 text-blue-500" />
                <CardTitle>📚 Learning Islands</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>Progressive Learning:</strong> Islands unlock based on performance</li>
                  <li>• <strong>Two Levels per Pair:</strong> Regular levels + Boss challenges</li>
                  <li>• <strong>Boss Levels:</strong> Harder calculations from current level</li>
                  <li>• <strong>Score System:</strong> Only boss scores count for leaderboards</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Play className="h-8 w-8 text-green-500" />
                <CardTitle>🎮 Gamified Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>Speed & Accuracy:</strong> 5-20 questions per session</li>
                  <li>• <strong>Time Penalties:</strong> +5 seconds for wrong answers</li>
                  <li>• <strong>Global Competition:</strong> Race against best times worldwide</li>
                  <li>• <strong>Progress Tracking:</strong> Visual charts showing improvement</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Trophy className="h-8 w-8 text-yellow-500" />
                <CardTitle>📖 Math Topics Covered</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-muted-foreground">
                  <li>1. <strong>BODMAS</strong> - Order of operations fundamentals</li>
                  <li>2. <strong>Grid Method</strong> - Fast multiplication techniques</li>
                  <li>3. <strong>Fraction Calculations</strong> - Mixed operations with fractions</li>
                  <li>4. <strong>Decimal Operations</strong> - All four operations with decimals</li>
                  <li>5. <strong>Percentage Basics</strong> - Percentage calculations</li>
                  <li>6. <strong>Algebra</strong> - Basic algebraic expressions</li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <CardTitle>🛠️ Tech Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>Frontend:</strong> Next.js, Shadcn UI</li>
                  <li>• <strong>Backend:</strong> Supabase (Authentication & Database)</li>
                  <li>• <strong>Hosting:</strong> Vercel</li>
                  <li>• <strong>Design:</strong> Mobile-first, responsive for all devices</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              🤝 About Us
            </h2>
          </div>

          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">🌍 Our Mission</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To democratize access to the proven Asian math learning methods that have consistently produced
                top-performing students globally, making these techniques accessible, engaging, and free for students worldwide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader className="pb-3">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                  <CardTitle className="text-center">Open Source</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    Free for educational purposes, making math mastery accessible to everyone
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <Globe className="h-8 w-8 text-blue-500 mx-auto" />
                  <CardTitle className="text-center">Global Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    Helping students worldwide learn the "Asian Way" of mathematical excellence
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <Award className="h-8 w-8 text-purple-500 mx-auto" />
                  <CardTitle className="text-center">Proven Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    Based on methods that have produced consistent top performers globally
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="pt-8">
              <blockquote className="text-xl font-medium text-foreground italic">
                "Making math mastery accessible to everyone, one challenge at a time."
              </blockquote>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
