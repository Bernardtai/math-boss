'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BossLevelInterfaceProps {
  children: ReactNode
  environment?: {
    theme?: string
    intensity?: number
    visual_effects?: {
      colorScheme?: string[]
      lighting?: 'dark' | 'dim' | 'normal'
      atmosphere?: string
    }
  }
  className?: string
}

export function BossLevelInterface({
  children,
  environment,
  className,
}: BossLevelInterfaceProps) {
  const bgColor = environment?.visual_effects?.colorScheme?.[0] || '#1a1a1a'
  const lighting = environment?.visual_effects?.lighting || 'dark'

  const lightingClasses = {
    dark: 'brightness-75 contrast-125',
    dim: 'brightness-90 contrast-110',
    normal: '',
  }

  return (
    <div
      className={cn(
        'relative min-h-screen transition-all duration-500',
        lightingClasses[lighting],
        className
      )}
      style={{
        backgroundColor: bgColor,
        backgroundImage: `radial-gradient(circle at 20% 50%, ${environment?.visual_effects?.colorScheme?.[1] || '#2d2d2d'} 0%, ${bgColor} 50%)`,
      }}
    >
      {/* Particle effects overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

