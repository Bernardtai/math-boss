'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DebugPage() {
  const [diagnostics, setDiagnostics] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const runDiagnostics = async () => {
      const results: any = {}

      // Check environment variables
      results.env = {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing',
        nodeEnv: process.env.NODE_ENV,
      }

      // Check Supabase connection
      try {
        const supabase = createClient()
        const { data, error } = await supabase.auth.getSession()
        results.supabase = {
          connected: !error,
          error: error?.message,
          session: data.session ? 'Present' : 'None'
        }
      } catch (e) {
        results.supabase = {
          connected: false,
          error: e instanceof Error ? e.message : 'Unknown error'
        }
      }

      // Check OAuth configuration
      try {
        const supabase = createClient()
        // This will fail if OAuth isn't configured, but we can catch the error
        results.oauth = { configured: true }
      } catch (e) {
        results.oauth = {
          configured: false,
          error: e instanceof Error ? e.message : 'Unknown error'
        }
      }

      setDiagnostics(results)
      setLoading(false)
    }

    runDiagnostics()
  }, [])

  if (loading) {
    return <div className="p-8">Running diagnostics...</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Authentication Diagnostics</h1>

      <div className="space-y-6">
        {/* Environment Variables */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Supabase URL:</span>
              <span className={diagnostics.env?.supabaseUrl ? 'text-green-600' : 'text-red-600'}>
                {diagnostics.env?.supabaseUrl ? '✅ Set' : '❌ Missing'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Supabase Key:</span>
              <span className={diagnostics.env?.supabaseKey === 'Present' ? 'text-green-600' : 'text-red-600'}>
                {diagnostics.env?.supabaseKey === 'Present' ? '✅ Present' : '❌ Missing'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Node Environment:</span>
              <span>{diagnostics.env?.nodeEnv || 'Not set'}</span>
            </div>
          </div>
        </div>

        {/* Supabase Connection */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Supabase Connection</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Connection Status:</span>
              <span className={diagnostics.supabase?.connected ? 'text-green-600' : 'text-red-600'}>
                {diagnostics.supabase?.connected ? '✅ Connected' : '❌ Failed'}
              </span>
            </div>
            {diagnostics.supabase?.error && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded">
                <strong>Error:</strong> {diagnostics.supabase.error}
              </div>
            )}
            <div className="flex justify-between">
              <span>Current Session:</span>
              <span>{diagnostics.supabase?.session || 'None'}</span>
            </div>
          </div>
        </div>

        {/* OAuth Configuration */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">OAuth Configuration</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Google OAuth:</span>
              <span className={diagnostics.oauth?.configured ? 'text-green-600' : 'text-orange-600'}>
                {diagnostics.oauth?.configured ? '✅ Should work' : '⚠️ May need configuration'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/login'}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Test Login Page
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Test Dashboard (will redirect if not logged in)
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
            >
              Refresh Diagnostics
            </button>
          </div>
        </div>

        {/* Troubleshooting Guide */}
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-yellow-800">Troubleshooting Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-yellow-700">
            <li><strong>Check Supabase Dashboard:</strong> Go to Authentication → Providers → Google and ensure it's enabled</li>
            <li><strong>Verify Redirect URLs:</strong> Add your domain to authorized redirect URLs in Supabase</li>
            <li><strong>Environment Variables:</strong> Ensure .env.local has correct Supabase credentials</li>
            <li><strong>Clear Browser Cache:</strong> Try in incognito mode or clear site data</li>
            <li><strong>Check Console:</strong> Open browser dev tools and check for JavaScript errors</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

