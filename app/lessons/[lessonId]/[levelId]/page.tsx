'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Level } from '@/lib/db/types'
import { getLevelByIdClient } from '@/lib/db/queries.client'
import { Question } from '@/lib/math-engine/types'
import { GameState, startGame, submitAnswer, updateTimer, getCurrentQuestion, getProgress } from '@/lib/game/game-state'
import { checkPassFail, calculateScore, validateAnswer } from '@/lib/game/game-logic'
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
  const [displayedQuestionIndex, setDisplayedQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null)

  const currentQuestion = gameState?.questions[displayedQuestionIndex] || null
  const progress = gameState ? getProgress(gameState) : { current: 0, total: 0, percentage: 0 }

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
      const initialState = {
        levelId,
        questions: generatedQuestions,
        currentQuestionIndex: 0,
        answers: [],
        timer: 0,
        startTime: null,
        isStarted: false,
        isCompleted: false,
        wrongAnswers: 0,
        correctAnswers: 0,
      }
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
      score,
      userId,
      levelId: level.id,
      lessonId
    })

    // Save progress
    try {
      const supabase = createClient()

      // Check authentication status
      const { data: authData, error: authError } = await supabase.auth.getUser()
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      console.log(`🔐 Auth check:`, {
        authData,
        authError,
        sessionData,
        sessionError,
        userId,
        hasValidSession: !!sessionData?.session,
        sessionUserId: sessionData?.session?.user?.id
      })

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
            const unlockResult = await supabase
              .from('user_unlocks')
              .upsert({
                user_id: userId,
                level_id: nextLevel.id,
              }, {
                onConflict: 'user_id,level_id'
              })

            if (unlockResult.error) {
              console.error(`❌ Failed to unlock level ${nextLevel.name}:`, unlockResult.error)
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

            if (lessonCompleted) {
              // Unlock next lesson
              const allLessons = await getLessonsClient()
              const nextLesson = getNextLesson(lessonId, allLessons)

              if (nextLesson) {
                // Find the first level of the next lesson and unlock it
                const nextLessonLevels = await getLevelsByLessonClient(nextLesson.id)
                const firstLevelOfNextLesson = nextLessonLevels.find(l => l.order_index === 1)

                if (firstLevelOfNextLesson) {
                  const lessonUnlockResult = await supabase
                    .from('user_unlocks')
                    .upsert({
                      user_id: userId,
                      level_id: firstLevelOfNextLesson.id,
                    }, {
                      onConflict: 'user_id,level_id'
                    })

                  if (lessonUnlockResult.error) {
                    console.error(`❌ Failed to unlock next lesson level:`, lessonUnlockResult.error)
                  } else {
                    console.log(`✅ Completed lesson and unlocked first level of next lesson: ${firstLevelOfNextLesson.name}`)
                  }
                }
              }
            }
          }
        } catch (unlockError) {
          console.error('Error unlocking level/lesson:', unlockError)
        }
      }
    } catch (error) {
      console.error('Error saving progress:', error)
    }
  }

  // Handle timer updates
  const handleTimeUpdate = useCallback((time: number) => {
    setGameState((prev) => prev ? updateTimer(prev, time) : null)
  }, [])

  // Handle game start
  const handleStart = () => {
    if (!gameState) return
    const newState = startGame(gameState)
    setGameState(newState)
    setDisplayedQuestionIndex(0)
    setQuestionStartTime(Date.now())
  }

  // Handle answer selection
  const handleAnswerSelect = (answer: string | number) => {
    if (showResult || !currentQuestion) return
    setSelectedAnswer(answer)
  }

  // Handle answer submission
  const handleSubmit = () => {
    if (!currentQuestion || selectedAnswer === null || !gameState) return

    const timeTaken = questionStartTime ? Math.floor((Date.now() - questionStartTime) / 1000) : 0
    const isCorrect = validateAnswer(currentQuestion, selectedAnswer)

    // Submit answer but don't advance question yet
    const answerData = {
      questionId: currentQuestion.id,
      userAnswer: selectedAnswer,
      isCorrect,
      timeTaken,
    }

    // Update game state with answer (but don't advance index)
    const newState = {
      ...gameState,
      answers: [...gameState.answers, answerData],
      wrongAnswers: gameState.wrongAnswers + (isCorrect ? 0 : 1),
      correctAnswers: gameState.correctAnswers + (isCorrect ? 1 : 0),
      timer: gameState.timer + (isCorrect ? 0 : 5), // +5 seconds penalty for wrong answer
    }

    setGameState(newState)

    // Show result briefly
    setShowResult(true)

    // Move to next question or complete after showing result
    setTimeout(() => {
      const isLastQuestion = displayedQuestionIndex === gameState.questions.length - 1

      if (isLastQuestion) {
        // Mark as completed
        const completedState = { ...newState, isCompleted: true, currentQuestionIndex: displayedQuestionIndex }
        setGameState(completedState)
        handleGameComplete(completedState)
      } else {
        // Advance to next question
        const nextIndex = displayedQuestionIndex + 1
        setDisplayedQuestionIndex(nextIndex)

        // Update game state with new question index for progress tracking
        const updatedState = { ...newState, currentQuestionIndex: nextIndex }
        setGameState(updatedState)

        // Reset for next question
        setSelectedAnswer(null)
        setShowResult(false)
        setQuestionStartTime(Date.now())
      }
    }, 2000)
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