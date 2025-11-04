'use client'

// Temporarily disabled Supabase for UI/UX development
// import { useEffect, useState } from 'react'
// import { LoginButton } from '@/components/auth/LoginButton'
// import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  // Mock status for UI/UX development
  const supabaseStatus = 'error'
  const envCheck = {url: false, key: false}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Math Boss</h1>
          <p className="mt-2 text-sm text-gray-600">
            Master math with the Asian method
          </p>
        </div>

        {/* Development Mode Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <h3 className="font-medium text-blue-800 mb-2">🎨 UI/UX Development Mode</h3>
          <div className="space-y-1 text-blue-700">
            <div>Authentication: Disabled for UI testing</div>
            <div>Supabase: Temporarily bypassed</div>
            <div>Status: Ready for visual development</div>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                UI/UX Development Mode
              </h2>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                🚀 Go to Dashboard (UI Testing)
              </button>
              <p className="mt-4 text-sm text-gray-600">
                Authentication is disabled for UI/UX development
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
