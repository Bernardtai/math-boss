'use client'

import { AvatarCustomization } from '@/lib/db/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface AvatarRendererProps {
  customization?: AvatarCustomization | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  pose?: 'idle' | 'running' | 'celebrating' | 'thinking'
  className?: string
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24',
}

const poseEmojis = {
  idle: '👤',
  running: '🏃',
  celebrating: '🎉',
  thinking: '🤔',
}

export function AvatarRenderer({
  customization,
  size = 'md',
  pose = 'idle',
  className,
}: AvatarRendererProps) {
  // For now, we'll use emoji-based rendering
  // In a full implementation, this would render SVG or use a sprite system
  const getAvatarDisplay = () => {
    if (!customization || Object.keys(customization).length === 0) {
      return poseEmojis[pose]
    }

    // Build a simple representation based on customization
    // This is a placeholder - full implementation would use proper graphics
    const hasHair = customization.hairStyle && customization.hairStyle !== 'bald'
    const hasAccessories = customization.accessories && customization.accessories.length > 0

    // Return emoji representation
    return poseEmojis[pose]
  }

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarFallback
        className={cn(
          'bg-gradient-to-br from-primary/20 to-primary/10',
          size === 'sm' && 'text-xs',
          size === 'md' && 'text-base',
          size === 'lg' && 'text-xl',
          size === 'xl' && 'text-3xl'
        )}
        style={{
          backgroundColor:
            customization?.skinColor && customization.skinColor !== 'default'
              ? customization.skinColor
              : undefined,
        }}
      >
        {getAvatarDisplay()}
      </AvatarFallback>
    </Avatar>
  )
}

