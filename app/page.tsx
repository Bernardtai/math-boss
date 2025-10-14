'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LoginButton } from '@/components/auth/LoginButton'

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)

      if (user) {
        router.push('/dashboard')
      }
    }

    getUser()
  }, [supabase.auth, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-16 text-center lg:pt-32">
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl">
            Master Math with the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Asian Method
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-gray-600">
            Join thousands of students worldwide who have mastered mathematics through gamified learning.
            Experience the proven Asian teaching methodology that produces top-performing students globally.
          </p>
          <div className="mt-10 flex justify-center gap-x-6">
            <LoginButton />
            <button className="text-sm font-semibold leading-6 text-gray-900">
              Learn more <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-lg bg-blue-500 text-white text-xl font-bold">
              +
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Addition</h3>
            <p className="mt-2 text-sm text-gray-600">Master the fundamentals of addition</p>
          </div>
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-lg bg-red-500 text-white text-xl font-bold">
              −
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Subtraction</h3>
            <p className="mt-2 text-sm text-gray-600">Build confidence in subtraction</p>
          </div>
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-lg bg-green-500 text-white text-xl font-bold">
              ×
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Multiplication</h3>
            <p className="mt-2 text-sm text-gray-600">Learn multiplication tables efficiently</p>
          </div>
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-lg bg-yellow-500 text-white text-xl font-bold">
              ÷
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Division</h3>
            <p className="mt-2 text-sm text-gray-600">Master division and remainders</p>
          </div>
        </div>
      </div>
    </div>
  )
}
