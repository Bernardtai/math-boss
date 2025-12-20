'use client'

import { useState, useRef, useEffect } from 'react'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Trophy, Target, Clock, TrendingUp, Star, Award, Calendar, MapPin, Edit, Rocket, Zap, Shield, Cpu, Plus, Loader2, Save, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getOrCreateProfile, updateProfile, uploadAvatar } from '@/lib/profile/profile'
import { getUserStats, getIslandProgress, getUserAchievements } from '@/lib/profile/stats'
import type { Profile, UserStats, IslandProgress, UserAchievement } from '@/lib/profile/types'
import { Input } from '@/components/ui/input'
import { AvatarCustomizer } from '@/components/profile/AvatarCustomizer'
import { AvatarRenderer } from '@/components/game/AvatarRenderer'

function ProfilePageContent() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [islandProgress, setIslandProgress] = useState<IslandProgress[]>([])
  const [achievements, setAchievements] = useState<UserAchievement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Editing states
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [isSavingName, setIsSavingName] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [showAvatarCustomizer, setShowAvatarCustomizer] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  // Fetch all profile data
  useEffect(() => {
    async function fetchProfileData() {
      try {
        setLoading(true)
        setError(null)

        // Get authenticated user
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !session?.user) {
          setError('Not authenticated')
          setLoading(false)
          return
        }

        const user = session.user
        const userId = user.id
        const email = user.email || ''
        
        // Get Google OAuth metadata
        const metadata = user.user_metadata || {}
        const googleName = metadata.full_name || metadata.name || ''
        const googleAvatar = metadata.avatar_url || metadata.picture || ''

        // Get or create profile
        let userProfile: Profile | null = null
        try {
          userProfile = await getOrCreateProfile(userId, email, {
            full_name: googleName,
            avatar_url: googleAvatar,
          })
        } catch (profileError: any) {
          // Check if it's a table missing error
          if (profileError?.message?.includes('table does not exist') || 
              profileError?.code === 'PGRST205' ||
              profileError?.code === '42P01') {
            setError(
              'The profiles table is missing from your database. ' +
              'Please run the SQL script: scripts/create-profiles-table.sql in your Supabase SQL Editor. ' +
              'This will create the required table and set up proper permissions.'
            )
            setLoading(false)
            return
          }
          // Re-throw other errors to be caught by outer catch
          throw profileError
        }

        if (!userProfile) {
          setError(
            'Failed to load or create profile. ' +
            'This may be due to missing database permissions or the profiles table not existing. ' +
            'Please ensure you have run scripts/create-profiles-table.sql in your Supabase SQL Editor.'
          )
          setLoading(false)
          return
        }

        setProfile(userProfile)
        setEditedName(userProfile.full_name || googleName || '')

        // Fetch statistics (handle errors gracefully - these tables might not exist yet)
        try {
          const stats = await getUserStats(userId)
          setUserStats(stats)
        } catch (statsError) {
          console.warn('Could not fetch user stats (tables may not exist):', statsError)
          // Set default stats
          setUserStats({
            lessonsCompleted: 0,
            bestScore: 0,
            timeStudied: 0,
            currentStreak: 0,
            totalPoints: 0,
          })
        }

        // Fetch island progress
        try {
          const progress = await getIslandProgress(userId)
          setIslandProgress(progress)
        } catch (progressError) {
          console.warn('Could not fetch island progress (tables may not exist):', progressError)
          setIslandProgress([])
        }

        // Fetch achievements
        try {
          const userAchievements = await getUserAchievements(userId)
          setAchievements(userAchievements)
        } catch (achievementsError) {
          console.warn('Could not fetch achievements (tables may not exist):', achievementsError)
          setAchievements([])
        }
      } catch (err: any) {
        // Only log non-table-missing errors to avoid console noise
        const isTableMissing = 
          err?.message?.includes('table does not exist') ||
          err?.code === 'PGRST205' ||
          err?.code === '42P01' ||
          err?.message?.includes('Could not find the table')
        
        if (!isTableMissing) {
          console.error('Error fetching profile data:', err)
        }
        
        // Set error message if not already set
        const errorMessage = err?.message || 'Failed to load profile data'
        if (isTableMissing) {
          setError(
            'The profiles table is missing from your database. ' +
            'Please run scripts/create-profiles-table.sql in your Supabase SQL Editor to set up the required database tables.'
          )
        } else {
          setError(`Failed to load profile data: ${errorMessage}`)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [supabase])

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !profile) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      alert('File size must be less than 5MB')
      return
    }

    try {
      setIsUploadingAvatar(true)

      // Upload to Supabase Storage
      const avatarUrl = await uploadAvatar(profile.id, file)
      
      if (!avatarUrl) {
        alert('Failed to upload image')
        return
      }

      // Update profile in database
      const updatedProfile = await updateProfile(profile.id, { avatar_url: avatarUrl })
      
      if (updatedProfile) {
        setProfile(updatedProfile)
      }
    } catch (err: any) {
      console.error('Error uploading avatar:', err)
      alert(err.message || 'Failed to upload image')
    } finally {
      setIsUploadingAvatar(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handlePlusClick = () => {
    fileInputRef.current?.click()
  }

  const handleEditName = () => {
    setIsEditingName(true)
    setEditedName(profile?.full_name || '')
  }

  const handleCancelEdit = () => {
    setIsEditingName(false)
    setEditedName(profile?.full_name || '')
  }

  const handleSaveName = async () => {
    if (!profile) return

    try {
      setIsSavingName(true)
      const updatedProfile = await updateProfile(profile.id, { full_name: editedName })
      
      if (updatedProfile) {
        setProfile(updatedProfile)
        setIsEditingName(false)
      }
    } catch (err) {
      console.error('Error saving name:', err)
      alert('Failed to save name')
    } finally {
      setIsSavingName(false)
    }
  }

  // Get display name and avatar
  const displayName = profile?.full_name || 'User'
  const displayAvatar = profile?.avatar_url || null
  const displayEmail = profile?.email || ''

  // Calculate age from date_of_birth if available
  const calculateAge = (dateOfBirth: string | null): number | null => {
    if (!dateOfBirth) return null
    const birthDate = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const userAge = calculateAge(profile?.date_of_birth || null)

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <p className="text-destructive mb-4">{error || 'Failed to load profile'}</p>
              <Button asChild>
                <a href="/login">Sign In</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Futuristic background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-purple-400/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-pink-400/10 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Command Center Header */}
        <div className="mb-8">
          <Card className="bg-purple-800/30 border-purple-600/30 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-3 bg-pink-800/50 backdrop-blur-sm border border-pink-600/30 rounded-full px-6 py-3 mb-4">
                  <Cpu className="h-6 w-6 text-cyan-400" />
                  <span className="text-pink-100 font-semibold">Personal Command Center</span>
                  <Rocket className="h-6 w-6 text-purple-400" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">Captain's Log</h1>
                <p className="text-purple-200">Monitor your mathematical conquests and plan your next mission</p>
              </div>

              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative group">
                  <Avatar className="h-24 w-24 ring-4 ring-purple-400/30">
                    <AvatarImage src={displayAvatar || undefined} />
                    <AvatarFallback className="text-2xl bg-purple-700 text-white">
                      {displayName.charAt(0).toUpperCase() || '👨‍🚀'}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={handlePlusClick}
                    disabled={isUploadingAvatar}
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 border-2 border-white dark:border-gray-800 flex items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-lg disabled:opacity-50"
                    aria-label="Upload profile picture"
                  >
                    {isUploadingAvatar ? (
                      <Loader2 className="h-4 w-4 text-white animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4 text-white" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploadingAvatar}
                  />
                </div>

                <div className="flex-1 text-center md:text-left">
                  {isEditingName ? (
                    <div className="flex items-center gap-2 mb-2">
                      <Input
                        value={editedName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedName(e.target.value)}
                        className="text-3xl font-bold text-white bg-purple-900/50 border-purple-600"
                        placeholder="Enter your name"
                        disabled={isSavingName}
                      />
                      <Button
                        size="sm"
                        onClick={handleSaveName}
                        disabled={isSavingName}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isSavingName ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={isSavingName}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-3xl font-bold text-white">{displayName}</h1>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEditName}
                        className="text-purple-200 hover:text-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-purple-200 mb-4">
                    {profile.country && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-cyan-400" />
                        <span>{profile.country}</span>
                      </div>
                    )}
                    {userAge !== null && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-pink-400" />
                        <span>Age: {userAge}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span>Mission Active</span>
                    </div>
                  </div>
                  <p className="text-purple-200 mb-4 max-w-md">
                    Elite mathematician mastering the Asian method! Commanding operations across BODMAS, fractions, and algebra galaxies.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Badge variant="secondary" className="text-center">
                    🏆 Beginner
                  </Badge>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{userStats?.totalPoints || 0}</div>
                    <div className="text-xs text-muted-foreground">Total Points</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats?.lessonsCompleted || 0}</div>
              <p className="text-xs text-muted-foreground">
                {userStats?.lessonsCompleted === 0 ? 'Start your journey!' : 'Keep it up!'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Score</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats?.bestScore || 0}</div>
              <p className="text-xs text-muted-foreground">
                {userStats?.bestScore === 0 ? 'Beat your record!' : 'Excellent work!'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Studied</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats?.timeStudied || 0}m</div>
              <p className="text-xs text-muted-foreground">Learning time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats?.currentStreak || 0}</div>
              <p className="text-xs text-muted-foreground">Consecutive days</p>
            </CardContent>
          </Card>
        </div>

        {/* Avatar Customization */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AvatarRenderer
                customization={profile?.avatar_customization || null}
                size="md"
                pose="idle"
              />
              <span>Customize Your Avatar</span>
            </CardTitle>
            <CardDescription>
              Design your character that appears throughout your adventure
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showAvatarCustomizer && profile ? (
              <AvatarCustomizer
                userId={profile.id}
                initialCustomization={profile.avatar_customization || null}
                onSave={(customization) => {
                  // Refresh profile after save
                  setProfile({ ...profile, avatar_customization: customization })
                  setShowAvatarCustomizer(false)
                }}
              />
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <AvatarRenderer
                    customization={profile?.avatar_customization || null}
                    size="lg"
                    pose="idle"
                  />
                  <div>
                    <p className="font-medium">Your Adventure Character</p>
                    <p className="text-sm text-muted-foreground">
                      {profile?.avatar_customization
                        ? 'Customize your avatar to change your appearance'
                        : 'Create your unique character for the adventure'}
                    </p>
                  </div>
                </div>
                <Button onClick={() => setShowAvatarCustomizer(true)}>
                  {profile?.avatar_customization ? 'Edit Avatar' : 'Create Avatar'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Island Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                Island Progress
              </CardTitle>
              <CardDescription>Your journey through the math islands</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {islandProgress.length > 0 ? (
                  islandProgress.map((island) => (
                    <div key={island.lessonId} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{island.lessonName}</span>
                        <span className="text-muted-foreground">
                          {island.completedLevels}/{island.totalLevels}
                        </span>
                      </div>
                      <Progress value={island.progress} className="h-2" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No progress data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Achievements
              </CardTitle>
              <CardDescription>Your math learning milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.length > 0 ? (
                  achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Award className="h-8 w-8 text-yellow-500" />
                      <div className="flex-1">
                        <h3 className="font-semibold">{achievement.name || 'Achievement'}</h3>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description || 'Earned achievement'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Earned: {new Date(achievement.earned_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No Achievements Yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Complete lessons and reach milestones to earn badges!
                    </p>
                    <Button size="sm" asChild>
                      <a href="/lessons">Start Learning</a>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-500" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest learning progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Activity Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your learning journey starts here! Complete your first lesson to see activity updates.
                </p>
                <Button asChild>
                  <a href="/lessons">Begin Learning</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfilePageContent />
    </AuthGuard>
  )
}
