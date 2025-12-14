'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

export default function DatabaseCheckPage() {
  const [checks, setChecks] = useState<{
    connected: boolean
    lessonsTable: boolean
    levelsTable: boolean
    lessonsCount: number
    levelsCount: number
    error: string | null
  }>({
    connected: false,
    lessonsTable: false,
    levelsTable: false,
    lessonsCount: 0,
    levelsCount: 0,
    error: null,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkDatabase() {
      const supabase = createClient()
      
      try {
        // Check connection
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        // Check if lessons table exists
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select('*')
          .limit(1)

        // Check if levels table exists
        const { data: levelsData, error: levelsError } = await supabase
          .from('levels')
          .select('*')
          .limit(1)

        // Count lessons
        const { count: lessonsCount } = await supabase
          .from('lessons')
          .select('*', { count: 'exact', head: true })

        // Count levels
        const { count: levelsCount } = await supabase
          .from('levels')
          .select('*', { count: 'exact', head: true })

        setChecks({
          connected: !sessionError,
          lessonsTable: !lessonsError,
          levelsTable: !levelsError,
          lessonsCount: lessonsCount || 0,
          levelsCount: levelsCount || 0,
          error: lessonsError?.message || levelsError?.message || null,
        })
      } catch (error) {
        setChecks({
          connected: false,
          lessonsTable: false,
          levelsTable: false,
          lessonsCount: 0,
          levelsCount: 0,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      } finally {
        setLoading(false)
      }
    }

    checkDatabase()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">Checking database...</div>
      </div>
    )
  }

  const allGood = checks.lessonsTable && checks.levelsTable && checks.lessonsCount === 6 && checks.levelsCount >= 40

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Database Setup Check</h1>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {checks.connected ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Connected to Supabase</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span>Not connected</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tables Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              {checks.lessonsTable ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Lessons table exists</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span>Lessons table NOT found</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {checks.levelsTable ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Levels table exists</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span>Levels table NOT found</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              {checks.lessonsCount === 6 ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Lessons: {checks.lessonsCount}/6 ✓</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <span>Lessons: {checks.lessonsCount}/6 (Expected 6)</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {checks.levelsCount >= 40 ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Levels: {checks.levelsCount}/42 ✓</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <span>Levels: {checks.levelsCount}/42 (Expected 42)</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {checks.error && (
          <Card className="border-red-500">
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-600">{checks.error}</p>
            </CardContent>
          </Card>
        )}

        {!allGood && (
          <Card className="border-yellow-500 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800">Setup Required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-yellow-800">
                Your database tables haven't been created yet. You need to run the migrations.
              </p>
              <div className="space-y-2">
                <h3 className="font-semibold text-yellow-900">Option 1: Supabase Dashboard (Easiest)</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-800">
                  <li>Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline">Supabase Dashboard</a></li>
                  <li>Select your project</li>
                  <li>Go to <strong>SQL Editor</strong></li>
                  <li>Open the file: <code className="bg-yellow-100 px-1 rounded">supabase/migrations/000_complete_setup.sql</code></li>
                  <li>Copy all contents and paste into SQL Editor</li>
                  <li>Click <strong>Run</strong></li>
                </ol>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-yellow-900">Option 2: Supabase CLI</h3>
                <div className="bg-yellow-100 p-3 rounded text-sm font-mono text-yellow-900">
                  <div>supabase link --project-ref qtvnvmnvbsoofdbcpybh</div>
                  <div>supabase db push</div>
                </div>
              </div>
              <Button
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Refresh Check
              </Button>
            </CardContent>
          </Card>
        )}

        {allGood && (
          <Card className="border-green-500 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">✓ Database Setup Complete!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-800 mb-4">
                All tables are created and data is seeded. You can now use the app!
              </p>
              <Button
                onClick={() => window.location.href = '/lessons'}
                className="w-full"
              >
                Go to Lessons
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

