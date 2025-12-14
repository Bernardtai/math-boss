'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Level, getLevelById } from '@/lib/db/queries'
import { Question } from '@/lib/math-engine/types'
import { GameState, createInitialGameState } from '@/lib/game/game-state'
import { checkPassFail, calculateScore } from '@/lib/game/game-logic'
import { QuestionEngine } from '@/lib/math-engine/QuestionEngine'
import { GameInterface } from '@/components/game/GameInterface'
import { GradeReflection } from '@/components/game/GradeReflection'
import { createClient } from '@/lib/supabase/client'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { redirect } from 'next/navigation'

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
      const levelData = await getLevelById(levelId)
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

      // If passed, unlock next level
      if (passed) {
        await supabase
          .from('user_unlocks')
          .insert({
            user_id: userId,
            level_id: level.id,
          })
          .catch(() => {
            // Ignore duplicate key errors
          })
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
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initialState = createInitialGameState(level.id, questions)
    setGameState(initialState)
    setIsLoading(false)
  }, [level.id, questions])

  const handleGameComplete = async (finalState: GameState) => {
    setGameState(finalState)
    setIsCompleted(true)

    // Calculate results
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

      // If passed, unlock next level
      if (passed) {
        // Get next level (this is simplified - in production, you'd query for the next level)
        // For now, we'll just mark this level as completed
        await supabase.from('user_unlocks').insert({
          user_id: userId,
          level_id: level.id,
        }).catch(() => {
          // Ignore duplicate key errors
        })
      }
    } catch (error) {
      console.error('Error saving progress:', error)
    }
  }

  if (isLoading || !gameState) {
    return <div>Loading...</div>
  }

  if (isCompleted) {
    return (
      <GradeReflection
        gameState={gameState}
        isBossLevel={isBossLevel}
        levelId={level.id}
        lessonId={lessonId}
      />
    )
  }

  return (
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
  )
}

