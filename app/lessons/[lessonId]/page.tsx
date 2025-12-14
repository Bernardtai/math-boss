'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Lesson, Level, UserProgress, UserUnlock } from '@/lib/db/types'
import { LevelGrid } from '@/components/lessons/LevelGrid'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getIslandTheme } from '@/lib/lessons/island-themes'

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = params.lessonId as string

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [levels, setLevels] = useState<Level[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [userUnlocks, setUserUnlocks] = useState<UserUnlock[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      try {
        // Load lesson - use client-side query
        const { data: lessonData, error: lessonError } = await supabase
          .from('lessons')
          .select('*')
          .eq('id', lessonId)
          .single()

        if (lessonError || !lessonData) {
          router.push('/lessons')
          return
        }
        setLesson(lessonData as Lesson)

        // Load levels
        const { data: levelsData, error: levelsError } = await supabase
          .from('levels')
          .select('*')
          .eq('lesson_id', lessonId)
          .order('order_index')

        if (!levelsError && levelsData) {
          setLevels(levelsData as Level[])
        }

        // Load user progress
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)

        if (!progressError && progressData) {
          setUserProgress(progressData as UserProgress[])
        }

        // Load user unlocks
        const { data: unlocksData, error: unlocksError } = await supabase
          .from('user_unlocks')
          .select('*')
          .eq('user_id', user.id)

        if (!unlocksError && unlocksData) {
          setUserUnlocks(unlocksData as UserUnlock[])
        }
      } catch (error) {
        console.error('Error loading lesson data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [lessonId, router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div>Loading...</div>
      </div>
    )
  }

  if (!lesson) {
    return null
  }

  const theme = getIslandTheme(lessonId)

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Button
          variant="ghost"
          onClick={() => router.push('/lessons')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Lessons
        </Button>

        <Card className={`mb-8 ${theme.bg} ${theme.border} border-2`}>
          <CardHeader>
            <CardTitle className="text-3xl text-white">{lesson.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {lesson.description && (
              <p className="text-white/90 text-lg">{lesson.description}</p>
            )}
          </CardContent>
        </Card>

        <LevelGrid
          levels={levels}
          userProgress={userProgress}
          userUnlocks={userUnlocks}
          lessonId={lessonId}
        />
      </div>
    </AuthGuard>
  )
}

