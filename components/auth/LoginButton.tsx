'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Chrome, Loader2 } from 'lucide-react'

export function LoginButton() {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        console.error('Error logging in:', error.message)
        alert('Failed to sign in. Please try again.')
      }
    } catch (error) {
      console.error('Unexpected error during login:', error)
      alert('An unexpected error occurred. Please try again.')
    } finally {
      // Keep loading state true as user will be redirected
      // setLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleGoogleLogin} 
      disabled={loading}
      className="w-full h-12 text-base font-semibold"
      size="lg"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Connecting to Google...
        </>
      ) : (
        <>
          <Chrome className="mr-2 h-5 w-5" />
          Sign in with Google
        </>
      )}
    </Button>
  )
}
