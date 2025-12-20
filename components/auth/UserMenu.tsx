'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
// Temporarily disabled Supabase authentication for UI/UX development
// import { createClient } from '@/lib/supabase/client'
// import { User, AuthChangeEvent, Session } from '@supabase/supabase-js'

export function UserMenu() {
  // Demo user for navigation showcase
  const [user] = useState({ email: 'demo@mathboss.com' })

  const handleLogout = () => {
    // Demo logout - reloads page to show navigation
    window.location.reload()
  }

  // Show demo user info
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-muted-foreground hidden md:inline">
        {user.email}
      </span>
      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
        DEMO
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
      >
        Refresh
      </Button>
    </div>
  )
}
