'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { getOrCreateProfile } from '@/lib/profile/profile'
import { Loader2 } from 'lucide-react'

interface AgeSelectionProps {
  onComplete?: () => void
  required?: boolean
}

export function AgeSelection({ onComplete, required = true }: AgeSelectionProps) {
  const [age, setAge] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleAgeSubmit = async () => {
    if (!age || age < 5 || age > 15) {
      setError('Please enter an age between 5 and 15')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('You must be logged in to set your age')
        setLoading(false)
        return
      }

      // Ensure profile exists first
      const profile = await getOrCreateProfile(
        user.id,
        user.email || '',
        {
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
        }
      )

      if (!profile) {
        setError('Failed to load or create profile. Please try again.')
        setLoading(false)
        return
      }

      // Try update first
      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({ age })
        .eq('id', user.id)
        .select()
        .single()

      if (updateError) {
        // If update fails, try upsert as fallback
        console.warn('Update failed, trying upsert:', {
          message: updateError.message,
          code: updateError.code,
        })

        const { data: upsertData, error: upsertError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email || '',
            age: age,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
          }, {
            onConflict: 'id',
          })
          .select()
          .single()

        if (upsertError) {
          console.error('Error upserting profile with age:', {
            message: upsertError.message,
            code: upsertError.code,
            details: upsertError.details,
            hint: upsertError.hint,
            fullError: upsertError,
          })
          setError(`Failed to save age: ${upsertError.message || 'Unknown error'}. Code: ${upsertError.code || 'N/A'}`)
          setLoading(false)
          return
        }

        console.log('Age saved via upsert:', upsertData)
      } else {
        console.log('Age updated successfully:', updateData)
      }

      setLoading(false)

      // Call onComplete callback if provided
      if (onComplete) {
        onComplete()
      }
    } catch (err) {
      console.error('Unexpected error:', {
        message: err instanceof Error ? err.message : String(err),
        error: err,
        stack: err instanceof Error ? err.stack : undefined,
      })
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          How old are you?
        </CardTitle>
        <CardDescription className="text-center">
          We'll customize your adventure based on your age (5-15 years old)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="age">Your Age</Label>
          <Input
            id="age"
            type="number"
            min="5"
            max="15"
            value={age || ''}
            onChange={(e) => {
              const value = parseInt(e.target.value)
              if (!isNaN(value)) {
                setAge(value)
                setError(null)
              } else {
                setAge(null)
              }
            }}
            placeholder="Enter your age (5-15)"
            className="text-center text-lg"
            disabled={loading}
          />
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
        </div>

        <Button
          onClick={handleAgeSubmit}
          disabled={!age || age < 5 || age > 15 || loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Continue'
          )}
        </Button>

        {!required && (
          <Button
            onClick={() => onComplete?.()}
            variant="ghost"
            className="w-full"
            disabled={loading}
          >
            Skip for now
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

