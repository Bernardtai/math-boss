'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LoginButton } from '@/components/auth/LoginButton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Container } from '@/components/layout/Container'
import { BookOpen, Target, Trophy, Zap, Globe, TrendingUp, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/dashboard')
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  if (loading) {
    return (
      <PageWrapper centered>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper className="bg-gradient-to-br from-background via-background to-muted">
      <Container size="xl" className="py-8 md:py-12">
        {/* Mobile Header - Show on small screens only */}
        <div className="md:hidden text-center mb-8 space-y-2 px-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Math Boss
            </h1>
          </div>
          <p className="text-base text-muted-foreground">
            Master math with the Asian method
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-[1.2fr_500px] gap-8 lg:gap-16 items-center">
          {/* Left side - Branding and Features (Desktop/Tablet) */}
          <div className="hidden md:block space-y-8 lg:space-y-10">
            {/* Hero Section */}
            <div className="space-y-4 lg:space-y-6">
              <div className="flex items-center gap-3">
                <Sparkles className="h-10 w-10 lg:h-12 lg:w-12 text-primary" />
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight">
                  Math Boss
                </h1>
              </div>
              <p className="text-lg lg:text-xl xl:text-2xl text-muted-foreground leading-relaxed">
                Master math with the Asian method
              </p>
              <p className="text-sm lg:text-base text-muted-foreground/80 leading-relaxed max-w-xl">
                Join thousands of students worldwide in mastering mathematics through proven Asian teaching methods, gamified challenges, and competitive learning.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid gap-5 lg:gap-6">
              <div className="flex items-start gap-4 lg:gap-5 group">
                <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                  <BookOpen className="h-6 w-6 lg:h-7 lg:w-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-base lg:text-lg mb-1">
                    Structured Lessons
                  </h3>
                  <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                    Progress through carefully designed math lessons that build upon each other
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 lg:gap-5 group">
                <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                  <Target className="h-6 w-6 lg:h-7 lg:w-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-base lg:text-lg mb-1">
                    Boss Challenges
                  </h3>
                  <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                    Test your skills with timed boss levels and prove your mastery
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 lg:gap-5 group">
                <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                  <Trophy className="h-6 w-6 lg:h-7 lg:w-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-base lg:text-lg mb-1">
                    Global Leaderboard
                  </h3>
                  <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                    Compete with students worldwide and climb the rankings
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 lg:gap-5 group">
                <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                  <Zap className="h-6 w-6 lg:h-7 lg:w-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-base lg:text-lg mb-1">
                    Track Progress
                  </h3>
                  <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                    Monitor your improvement with detailed statistics and analytics
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login Card */}
          <div className="w-full max-w-md mx-auto md:max-w-none">
            <Card className="border-2 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
              <CardHeader className="space-y-3 sm:space-y-4 text-center px-6 sm:px-8 pt-8 sm:pt-10">
                <CardTitle className="text-2xl sm:text-3xl font-bold">
                  Welcome Back!
                </CardTitle>
                <CardDescription className="text-sm sm:text-base leading-relaxed">
                  Sign in with your Google account to continue your math journey
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6 sm:space-y-7 px-6 sm:px-8 pb-8 sm:pb-10">
                {/* Login Button */}
                <LoginButton />
                
                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-3 text-muted-foreground font-medium">
                      Why sign in?
                    </span>
                  </div>
                </div>

                {/* Benefits List */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3 text-muted-foreground group">
                    <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Globe className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-xs sm:text-sm">
                      Access your progress from any device
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-muted-foreground group">
                    <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-xs sm:text-sm">
                      Track your learning statistics
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-muted-foreground group">
                    <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Trophy className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-xs sm:text-sm">
                      Compete on global leaderboards
                    </span>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="pt-5 border-t border-border">
                  <p className="text-xs text-center text-muted-foreground leading-relaxed">
                    By signing in, you agree to our{' '}
                    <a href="#" className="text-primary hover:underline">
                      Terms of Service
                    </a>
                    {' '}and{' '}
                    <a href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Mobile-only tagline */}
            <div className="md:hidden mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Join thousands of students mastering math worldwide 🌍
              </p>
            </div>
          </div>
        </div>
      </Container>
    </PageWrapper>
  )
}
