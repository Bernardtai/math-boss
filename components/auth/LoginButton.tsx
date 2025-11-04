'use client'

// Temporarily disabled Supabase authentication for UI/UX development
// import { useState } from 'react'
// import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export function LoginButton() {
  // Mock login for UI/UX development
  const handleLogin = () => {
    console.log('Mock login clicked - authentication disabled for UI/UX development')
    // Simulate loading state for UI testing
    setTimeout(() => {
      window.location.href = '/dashboard'
    }, 1000)
  }

  return (
    <Button onClick={handleLogin} className="w-full">
      🎨 Mock Login (UI Testing)
    </Button>
  )
}
