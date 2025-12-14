'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

interface TimerProps {
  initialTime: number
  isRunning: boolean
  onTimeUpdate?: (time: number) => void
  penalty?: number // Additional seconds to add
}

export function Timer({ initialTime, isRunning, onTimeUpdate, penalty = 0 }: TimerProps) {
  const [time, setTime] = useState(initialTime)

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning])

  // Notify parent component of time updates
  useEffect(() => {
    if (onTimeUpdate && isRunning) {
      onTimeUpdate(time)
    }
  }, [time, onTimeUpdate, isRunning])

  useEffect(() => {
    if (penalty > 0) {
      setTime((prev) => prev + penalty)
    }
  }, [penalty])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-background border rounded-lg">
      <Clock className="h-5 w-5 text-primary" />
      <span className="text-lg font-mono font-semibold">{formatTime(time)}</span>
    </div>
  )
}

