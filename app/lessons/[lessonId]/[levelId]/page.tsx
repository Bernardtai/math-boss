'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Level } from '@/lib/db/types'
import { getLevelByIdClient } from '@/lib/db/queries.client'
import { Question } from '@/lib/math-engine/types'
import { GameState, createInitialGameState } from '@/lib/game/game-state'
import { checkPassFail, calculateScore } from '@/lib/game/game-logic'
import { QuestionEngine } from '@/lib/math-engine/QuestionEngine'
import { GameInterface } from '@/components/game/GameInterface'
import { GradeReflection } from '@/components/game/GradeReflection'
import { createClient } from '@/lib/supabase/client'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { redirect } from 'next/navigation'
import { getNextLevel, getNextLesson, isLessonCompleted } from '@/lib/lessons/unlock-logic'
import { getLevelsByLessonClient, getLessonsClient, getUserProgressClient } from '@/lib/db/queries.client'

export default function LevelPage() {
  const params = useParams()
  const lessonId = params.lessonId as string
  const levelId = params.levelId as string

  const [level, setLevel] = useState<Level | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        redirect('/login')
        return
      }

      setUserId(user.id)

      // Get level data
      const levelData = await getLevelByIdClient(levelId)
      if (!levelData) {
        redirect('/lessons')
        return
      }

      setLevel(levelData)

      // Check if level is unlocked
      const isBossLevel = levelData.level_type.startsWith('boss')
      const questionCount = levelData.question_count

      // Generate questions
      const questionEngine = new QuestionEngine()
      const generatedQuestions = questionEngine.generateQuestions(
        lessonId,
        levelData.order_index,
        questionCount,
        isBossLevel
      )

      setQuestions(generatedQuestions)

      // Initialize game state
      const initialState = createInitialGameState(levelData.id, generatedQuestions)
      setGameState(initialState)
      setIsLoading(false)
    }

    loadData()
  }, [lessonId, levelId])

  const handleGameComplete = async (finalState: GameState) => {
    if (!level || !userId) return

    setGameState(finalState)
    setIsCompleted(true)

    // Calculate results
    const isBossLevel = level.level_type.startsWith('boss')
    const passed = checkPassFail(finalState, isBossLevel)
    const score = calculateScore(finalState, isBossLevel)

    // Save progress
    try {
      const supabase = createClient()
      await supabase.from('user_progress').upsert({
        user_id: userId,
        level_id: level.id,
        score,
        time_taken: finalState.timer,
        questions_answered: finalState.questions.length,
        questions_correct: finalState.correctAnswers,
        questions_wrong: finalState.wrongAnswers,
        passed,
        is_boss_level: isBossLevel,
      })

      // If passed, unlock next level or next lesson
      if (passed) {
        try {
          // Get all levels in this lesson to find the next level
          const allLevels = await getLevelsByLessonClient(lessonId)
          const nextLevel = getNextLevel(level.id, allLevels)

          if (nextLevel) {
            // Unlock next level in same lesson
            await supabase
              .from('user_unlocks')
              .insert({
                user_id: userId,
                level_id: nextLevel.id,
              })
            console.log(`Unlocked next level: ${nextLevel.name}`)
          } else {
            // No more levels in this lesson - check if lesson is completed
            const userProgress = await getUserProgressClient(userId)
            const lessonCompleted = isLessonCompleted(lessonId, userProgress, allLevels)

            if (lessonCompleted) {
              // Unlock next lesson
              const allLessons = await getLessonsClient()
              const nextLesson = getNextLesson(lessonId, allLessons)

              if (nextLesson) {
                // Find the first level of the next lesson and unlock it
                const nextLessonLevels = await getLevelsByLessonClient(nextLesson.id)
                const firstLevelOfNextLesson = nextLessonLevels.find(l => l.order_index === 1)

                if (firstLevelOfNextLesson) {
                  await supabase
                    .from('user_unlocks')
                    .insert({
                      user_id: userId,
                      level_id: firstLevelOfNextLesson.id,
                    })
                  console.log(`Completed lesson and unlocked first level of next lesson: ${firstLevelOfNextLesson.name}`)
                }
              } else {
                console.log('All lessons completed! Congratulations!')
              }
            }
          }
        } catch (unlockError) {
          // Ignore duplicate key errors (level already unlocked)
          if ((unlockError as any)?.code !== '23505') {
            console.error('Error unlocking level/lesson:', unlockError)
          }
        }
      }
    } catch (error) {
      console.error('Error saving progress:', error)
    }
  }

  if (isLoading || !gameState || !level || !userId) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div>Loading...</div>
      </div>
    )
  }

  const isBossLevel = level.level_type.startsWith('boss')

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {isCompleted ? (
          <GradeReflection
            gameState={gameState}
            isBossLevel={isBossLevel}
            levelId={level.id}
            lessonId={lessonId}
          />
        ) : (
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{level.name}</h1>
              <p className="text-muted-foreground">{level.description}</p>
            </div>
            <GameInterface
              questions={questions}
              levelId={level.id}
              isBossLevel={isBossLevel}
              onComplete={handleGameComplete}
            />
          </div>
        )}
      </div>
    </AuthGuard>
  )
}

