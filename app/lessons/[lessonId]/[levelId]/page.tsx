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
import { StoryDisplay } from '@/components/game/StoryDisplay'
import { createClient } from '@/lib/supabase/client'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { redirect } from 'next/navigation'
import { getNextLevel, getNextLesson, isLessonCompleted } from '@/lib/lessons/unlock-logic'
import { getLevelsByLessonClient, getLessonsClient, getUserProgressClient } from '@/lib/db/queries.client'
import { getOrCreateProfile } from '@/lib/profile/profile'
import { getStoryIntro, getFailureVariant, getStoryState, updateStoryStateAfterFailure, resetStoryState } from '@/lib/storyline/story-manager'
import { calculateMissionProgress, isMissionComplete, MissionType } from '@/lib/game/missions'
import { EscapeMission } from '@/components/game/missions/EscapeMission'
import { HitMission } from '@/components/game/missions/HitMission'
import { CollectMission } from '@/components/game/missions/CollectMission'
import { RaceMission } from '@/components/game/missions/RaceMission'
import { PuzzleMission } from '@/components/game/missions/PuzzleMission'
import { DefendMission } from '@/components/game/missions/DefendMission'
import { BossLevelInterface } from '@/components/game/BossLevelInterface'
import type { Profile } from '@/lib/profile/types'
import type { UserStoryState } from '@/lib/db/types'

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
  
  // Story and mission state
  const [userProfile, setUserProfile] = useState<Profile | null>(null)
  const [storyState, setStoryState] = useState<UserStoryState | null>(null)
  const [showStoryIntro, setShowStoryIntro] = useState(false)
  const [showFailureStory, setShowFailureStory] = useState(false)
  const [failureStoryText, setFailureStoryText] = useState<string>('')
  const [gameStarted, setGameStarted] = useState(false)

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

      // Get user profile for age and avatar
      const profile = await getOrCreateProfile(
        user.id,
        user.email || '',
        {
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
        }
      )
      if (profile) {
        setUserProfile(profile)
      }

      // Get level data
      const levelData = await getLevelByIdClient(levelId)
      if (!levelData) {
        redirect('/lessons')
        return
      }

      setLevel(levelData)

      // Load story state
      const storyStateData = await getStoryState(user.id, levelId)
      if (storyStateData) {
        setStoryState(storyStateData)
      }

      // Show story intro if available
      if (levelData.story_intro) {
        setShowStoryIntro(true)
      }

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

    // Handle story state based on pass/fail
    if (passed) {
      // Reset story state on success
      await resetStoryState(userId, levelId)
    } else {
      // Update story state with failure
      const failureType = finalState.wrongAnswers > 4 ? 'wrong_answers' : 'too_slow'
      const updatedStoryState = await updateStoryStateAfterFailure(userId, levelId, failureType)
      if (updatedStoryState && level.story_failure_variants) {
        setStoryState(updatedStoryState)
        // Show failure variant story
        const failureStory = getFailureVariant(
          level,
          updatedStoryState.attempt_count,
          failureType,
          userProfile?.age || null
        )
        setFailureStoryText(failureStory)
        setShowFailureStory(true)
      }
    }

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

      // Ensure profile exists before saving progress
      if (authData?.user) {
        try {
          const profile = await getOrCreateProfile(
            userId,
            authData.user.email || '',
            {
              full_name: authData.user.user_metadata?.full_name || authData.user.user_metadata?.name || null,
              avatar_url: authData.user.user_metadata?.avatar_url || authData.user.user_metadata?.picture || null,
            }
          )
          if (!profile) {
            console.warn(`⚠️ Profile creation failed for user ${userId}, but continuing...`)
          } else {
            console.log(`✅ Profile verified/created for user ${userId}`)
          }
        } catch (profileError) {
          console.error(`❌ Error ensuring profile exists:`, profileError)
          // Continue anyway - the database trigger might create it, or we'll get a clearer error
        }
      }

      console.log(`💾 Saving progress:`, {
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

      const progressResult = await supabase.from('user_progress').upsert({
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

      console.log(`💾 Progress save result:`, {
        data: progressResult.data,
        error: progressResult.error ? {
          message: progressResult.error.message,
          code: progressResult.error.code,
          details: progressResult.error.details,
          hint: progressResult.error.hint,
        } : null,
      })

      if (progressResult.error) {
        console.error(`❌ Failed to save progress:`, {
          message: progressResult.error.message,
          code: progressResult.error.code,
          details: progressResult.error.details,
          hint: progressResult.error.hint,
          fullError: progressResult.error,
        })
        throw new Error(`Failed to save progress: ${progressResult.error.message || 'Unknown error'}`)
      }

      // If passed, unlock next level or next lesson
      if (passed) {
        try {
          // Get all levels in this lesson to find the next level
          const allLevels = await getLevelsByLessonClient(lessonId)
          const nextLevel = getNextLevel(level.id, allLevels)

          if (nextLevel) {
            // Unlock next level in same lesson
            console.log(`🔓 Unlocking next level:`, {
              user_id: userId,
              level_id: nextLevel.id,
              levelName: nextLevel.name
            })

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
              console.error(`❌ Failed to unlock level ${nextLevel.name}:`, unlockResult.error)
              throw new Error(`Failed to unlock level: ${unlockResult.error.message}`)
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
                  console.log(`🎉 Unlocking first level of next lesson:`, {
            user_id: userId,
                    level_id: firstLevelOfNextLesson.id,
                    levelName: firstLevelOfNextLesson.name
                  })

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
                    console.error(`❌ Failed to unlock next lesson level:`, lessonUnlockResult.error)
                    throw new Error(`Failed to unlock next lesson: ${lessonUnlockResult.error.message}`)
                  } else {
                    console.log(`✅ Completed lesson and unlocked first level of next lesson: ${firstLevelOfNextLesson.name}`)
                  }
                }
              }
            }
          }
        } catch (unlockError) {
          console.error('Error unlocking level/lesson:', {
            message: unlockError instanceof Error ? unlockError.message : String(unlockError),
            error: unlockError,
          })
        }
      }
    } catch (error) {
      console.error('Error saving progress:', {
        message: error instanceof Error ? error.message : String(error),
        error: error,
        stack: error instanceof Error ? error.stack : undefined,
      })
    }
  }

  // Handle timer updates
  const handleTimeUpdate = useCallback((time: number) => {
    setGameState((prev) => prev ? updateTimer(prev, time) : null)
  }, [])

  // Handle story intro continue
  const handleStoryIntroContinue = () => {
    setShowStoryIntro(false)
    setGameStarted(true)
  }

  // Handle failure story continue
  const handleFailureStoryContinue = () => {
    setShowFailureStory(false)
    setIsCompleted(false)
    // Reset game state for retry
    if (gameState) {
      const resetState = {
        ...gameState,
        isStarted: false,
        isCompleted: false,
        answers: [],
        currentQuestionIndex: 0,
        timer: 0,
        wrongAnswers: 0,
        correctAnswers: 0,
      }
      setGameState(resetState)
      setDisplayedQuestionIndex(0)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

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
        // GameInterface will call onComplete prop
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
  const missionType = level.mission_type || 'escape'

  // Render mission overlay component based on mission type
  const renderMissionOverlay = () => {
    if (!gameState || !gameState.isStarted || gameState.isCompleted) return null

    const progress = calculateMissionProgress(
      missionType as MissionType,
      gameState.correctAnswers,
      gameState.questions.length,
      gameState.wrongAnswers,
      gameState.timer
    )

    const missionProps = {
      progress,
      correctAnswers: gameState.correctAnswers,
      totalQuestions: gameState.questions.length,
      timeRemaining: undefined,
    }

    switch (missionType) {
      case 'escape':
        return <EscapeMission {...missionProps} />
      case 'hit':
        return <HitMission progress={progress} hits={gameState.correctAnswers} targetHits={gameState.questions.length} />
      case 'collect':
        return <CollectMission progress={progress} collected={gameState.correctAnswers} targetCollect={gameState.questions.length} />
      case 'race':
        return <RaceMission {...missionProps} />
      case 'puzzle':
        return <PuzzleMission progress={progress} puzzlesSolved={gameState.correctAnswers} targetPuzzles={gameState.questions.length} />
      case 'defend':
        return <DefendMission progress={progress} health={gameState.questions.length - gameState.wrongAnswers} maxHealth={gameState.questions.length} attacksBlocked={gameState.correctAnswers} />
      default:
        return null
    }
  }

  // Show story intro before game starts
  if (showStoryIntro && level.story_intro) {
    const storyText = getStoryIntro(level, userProfile?.age || null)
    return (
      <AuthGuard>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <StoryDisplay
            storyText={storyText}
            avatarCustomization={userProfile?.avatar_customization || null}
            onContinue={handleStoryIntroContinue}
            showContinueButton={true}
            animated={true}
          />
        </div>
      </AuthGuard>
    )
  }

  // Show failure story if failed
  if (showFailureStory && failureStoryText) {
    return (
      <AuthGuard>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <StoryDisplay
            storyText={failureStoryText}
            avatarCustomization={userProfile?.avatar_customization || null}
            onContinue={handleFailureStoryContinue}
            showContinueButton={true}
            animated={true}
          />
        </div>
      </AuthGuard>
    )
  }

  // Apply boss environment styling
  const bossEnvironmentStyle = isBossLevel && level.boss_environment
    ? {
        backgroundColor: level.boss_environment.visual_effects?.colorScheme?.[0] || undefined,
        color: '#ffffff',
      }
    : {}

  const content = (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {isCompleted ? (
        <GradeReflection
          gameState={gameState}
          isBossLevel={isBossLevel}
          levelId={level.id}
          lessonId={lessonId}
          userId={userId}
        />
      ) : (
        <div className="relative">
          {/* Mission Overlay */}
          {renderMissionOverlay()}
          
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
  )

  // Wrap boss levels with BossLevelInterface for enhanced environment
  if (isBossLevel && level.boss_environment) {
    return (
      <AuthGuard>
        <BossLevelInterface environment={level.boss_environment}>
          {content}
        </BossLevelInterface>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      {content}
    </AuthGuard>
  )
}