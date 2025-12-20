/**
 * Boss Environment System
 * Defines darker, more evil environments for boss levels with age-appropriate intensity
 */

import { getAgeGroup, getContentIntensity } from '@/lib/content/age-filter'
import type { AgeGroup } from '@/lib/content/age-filter'

export interface BossEnvironment {
  theme: string
  intensity: number // 0-1, adjusted by age
  visualEffects: {
    colorScheme: string[]
    particles?: string[]
    lighting?: 'dark' | 'dim' | 'normal'
    atmosphere?: string
  }
  soundEffects?: string[]
  description: string
}

const baseBossEnvironments: Record<string, Omit<BossEnvironment, 'intensity'>> = {
  dark_forest: {
    theme: 'Dark Forest',
    visualEffects: {
      colorScheme: ['#1a1a1a', '#2d2d2d', '#4a4a4a', '#8b0000'],
      particles: ['fog', 'shadows'],
      lighting: 'dark',
      atmosphere: 'ominous',
    },
    description: 'A dark and foreboding forest where shadows move on their own.',
  },
  haunted_castle: {
    theme: 'Haunted Castle',
    visualEffects: {
      colorScheme: ['#2d1810', '#4a2c1a', '#6b4423', '#8b0000'],
      particles: ['dust', 'sparks'],
      lighting: 'dim',
      atmosphere: 'eerie',
    },
    description: 'An ancient castle filled with mysterious sounds and moving shadows.',
  },
  volcanic_cavern: {
    theme: 'Volcanic Cavern',
    visualEffects: {
      colorScheme: ['#1a0000', '#4a0000', '#8b0000', '#ff4500'],
      particles: ['embers', 'smoke'],
      lighting: 'dim',
      atmosphere: 'intense',
    },
    description: 'A deep cavern near a volcano, filled with heat and danger.',
  },
  shadow_realm: {
    theme: 'Shadow Realm',
    visualEffects: {
      colorScheme: ['#000000', '#1a1a2e', '#16213e', '#0f3460'],
      particles: ['shadows', 'mist'],
      lighting: 'dark',
      atmosphere: 'mysterious',
    },
    description: 'A realm where darkness reigns and reality bends.',
  },
}

/**
 * Get boss environment with age-appropriate intensity
 */
export function getBossEnvironment(
  environmentKey: string,
  age: number | null
): BossEnvironment | null {
  const baseEnv = baseBossEnvironments[environmentKey]
  if (!baseEnv) return null

  const ageGroup = getAgeGroup(age)
  const intensity = getContentIntensity(ageGroup)

  // Adjust intensity based on age
  const adjustedIntensity = Math.min(1.0, intensity.scariness * 1.2) // Boss levels are slightly scarier

  return {
    ...baseEnv,
    intensity: adjustedIntensity,
    description: adjustDescriptionForAge(baseEnv.description, ageGroup),
  }
}

/**
 * Adjust environment description for age
 */
function adjustDescriptionForAge(description: string, ageGroup: AgeGroup): string {
  const adjustments: Record<AgeGroup, (text: string) => string> = {
    age_5_7: (text) =>
      text
        .replace('foreboding', 'mysterious')
        .replace('ominous', 'a little scary')
        .replace('haunted', 'old')
        .replace('eerie', 'spooky')
        .replace('intense', 'exciting')
        .replace('danger', 'challenge'),
    age_8_10: (text) =>
      text
        .replace('foreboding', 'mysterious')
        .replace('ominous', 'scary')
        .replace('eerie', 'spooky'),
    age_11_15: (text) => text, // Keep original for older ages
  }

  return adjustments[ageGroup](description)
}

/**
 * Get default boss environment
 */
export function getDefaultBossEnvironment(age: number | null): BossEnvironment {
  return getBossEnvironment('dark_forest', age) || {
    theme: 'Boss Arena',
    intensity: 0.5,
    visualEffects: {
      colorScheme: ['#2d2d2d', '#4a4a4a'],
      lighting: 'dim',
      atmosphere: 'intense',
    },
    description: 'A challenging arena where you face your greatest test.',
  }
}

