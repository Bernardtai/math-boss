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

    console.log(`Level completion check for ${level.name}:`, {
      isBossLevel,
      correctAnswers: finalState.correctAnswers,
      wrongAnswers: finalState.wrongAnswers,
      totalQuestions: finalState.questions.length,
      passed,
      score
    })

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
        console.log(`🎯 Level passed! Starting unlock process for level: ${level.name}`)
        try {
          // Get all levels in this lesson to find the next level
          const allLevels = await getLevelsByLessonClient(lessonId)
          console.log(`📋 Found ${allLevels.length} levels in lesson ${lessonId}`)
          const nextLevel = getNextLevel(level.id, allLevels)
          console.log(`🎯 Next level in same lesson:`, nextLevel)

          if (nextLevel) {
            // Unlock next level in same lesson
            console.log(`🔓 Attempting to unlock level: ${nextLevel.id} (${nextLevel.name})`)
            const unlockResult = await supabase
              .from('user_unlocks')
              .upsert({
                user_id: userId,
                level_id: nextLevel.id,
              }, {
                onConflict: 'user_id,level_id'
              })
            console.log(`🔓 Unlock result:`, unlockResult)
            if (unlockResult.error) {
              console.error(`❌ Failed to unlock level ${nextLevel.name}:`, {
                error: unlockResult.error,
                code: unlockResult.error?.code,
                message: unlockResult.error?.message,
                details: unlockResult.error?.details,
                hint: unlockResult.error?.hint
              })
            } else {
              console.log(`✅ Successfully unlocked next level: ${nextLevel.name}`)
            }
          } else {
            // No more levels in this lesson - check if lesson is completed
            const userProgress = await getUserProgressClient(userId)
            const lessonCompleted = isLessonCompleted(lessonId, userProgress, allLevels, {
              levelId: level.id,
              passed: passed
            })

            console.log(`📚 Lesson ${lessonId} completion check:`, {
              lessonCompleted,
              currentLevelPassed: passed,
              totalLevelsInLesson: allLevels.length,
              userProgressCount: userProgress.filter(p => allLevels.some(l => l.id === p.level_id)).length,
              allLevelsDetails: allLevels.map(l => ({ id: l.id, name: l.name, order: l.order_index })),
              userProgressDetails: userProgress.filter(p => allLevels.some(l => l.id === p.level_id)).map(p => ({ levelId: p.level_id, passed: p.passed }))
            })

            if (lessonCompleted) {
              // Unlock next lesson
              const allLessons = await getLessonsClient()
              const nextLesson = getNextLesson(lessonId, allLessons)

              console.log(`Next lesson for ${lessonId}:`, nextLesson)

              if (nextLesson) {
                // Find the first level of the next lesson and unlock it
                const nextLessonLevels = await getLevelsByLessonClient(nextLesson.id)
                const firstLevelOfNextLesson = nextLessonLevels.find(l => l.order_index === 1)

                console.log(`First level of next lesson ${nextLesson.id}:`, firstLevelOfNextLesson)

                if (firstLevelOfNextLesson) {
                  console.log(`🎉 Attempting to unlock first level of next lesson: ${firstLevelOfNextLesson.id} (${firstLevelOfNextLesson.name})`)
                  const lessonUnlockResult = await supabase
                    .from('user_unlocks')
                    .upsert({
                      user_id: userId,
                      level_id: firstLevelOfNextLesson.id,
                    }, {
                      onConflict: 'user_id,level_id'
                    })
                  console.log(`🎉 Lesson unlock result:`, lessonUnlockResult)
                  if (lessonUnlockResult.error) {
                    console.error(`❌ Failed to unlock next lesson level:`, {
                      error: lessonUnlockResult.error,
                      code: lessonUnlockResult.error?.code,
                      message: lessonUnlockResult.error?.message,
                      details: lessonUnlockResult.error?.details,
                      hint: lessonUnlockResult.error?.hint
                    })
                  } else {
                    console.log(`✅ Completed lesson and unlocked first level of next lesson: ${firstLevelOfNextLesson.name}`)
                  }
                } else {
                  console.log('❌ No first level found for next lesson')
                }
              } else {
                console.log('🎉 All lessons completed! Congratulations!')
              }
            } else {
              console.log('❌ Lesson not yet completed - more levels to finish')
            }
          }
        } catch (unlockError) {
          console.error('Error unlocking level/lesson:', {
            error: unlockError,
            code: (unlockError as any)?.code,
            message: (unlockError as any)?.message,
            details: (unlockError as any)?.details,
            hint: (unlockError as any)?.hint
          })
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

