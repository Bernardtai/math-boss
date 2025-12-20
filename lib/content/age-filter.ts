/**
 * Age-Based Content Filter
 * Adjusts story complexity, vocabulary, and scariness based on user age
 */

export type AgeGroup = 'age_5_7' | 'age_8_10' | 'age_11_15'

export interface ContentIntensity {
  complexity: number // 0-1, where 1 is most complex
  vocabulary: number // 0-1, where 1 is most advanced
  scariness: number // 0-1, where 1 is most scary
  descriptionLength: number // 0-1, where 1 is longest descriptions
}

/**
 * Get age group from age
 */
export function getAgeGroup(age: number | null): AgeGroup {
  if (!age) return 'age_8_10'
  if (age >= 5 && age <= 7) return 'age_5_7'
  if (age >= 8 && age <= 10) return 'age_8_10'
  return 'age_11_15'
}

/**
 * Get content intensity for an age group
 */
export function getContentIntensity(ageGroup: AgeGroup): ContentIntensity {
  const intensities: Record<AgeGroup, ContentIntensity> = {
    age_5_7: {
      complexity: 0.2,
      vocabulary: 0.1,
      scariness: 0.1,
      descriptionLength: 0.3,
    },
    age_8_10: {
      complexity: 0.5,
      vocabulary: 0.4,
      scariness: 0.4,
      descriptionLength: 0.6,
    },
    age_11_15: {
      complexity: 1.0,
      vocabulary: 0.9,
      scariness: 0.8,
      descriptionLength: 1.0,
    },
  }

  return intensities[ageGroup]
}

/**
 * Filter story text based on age
 */
export function filterStoryByAge(storyText: string, age: number | null): string {
  const ageGroup = getAgeGroup(age)
  const intensity = getContentIntensity(ageGroup)

  // For now, return as-is. In a full implementation, this would:
  // - Replace complex words with simpler ones for younger ages
  // - Adjust sentence length
  // - Modify scary/exciting content
  return storyText
}

/**
 * Adjust vocabulary complexity
 */
export function adjustVocabulary(text: string, ageGroup: AgeGroup): string {
  // Placeholder - would contain word replacement mappings
  // Example: "terrifying" -> "scary" for age_5_7, "frightening" for age_8_10
  return text
}

/**
 * Adjust description length
 */
export function adjustDescriptionLength(text: string, ageGroup: AgeGroup): string {
  const intensity = getContentIntensity(ageGroup)
  
  if (ageGroup === 'age_5_7' && intensity.descriptionLength < 0.5) {
    // Shorten descriptions for younger ages
    const sentences = text.split(/[.!?]+/).filter(s => s.trim())
    const targetLength = Math.max(1, Math.floor(sentences.length * intensity.descriptionLength))
    return sentences.slice(0, targetLength).join('. ') + '.'
  }

  return text
}

/**
 * Adjust scariness level
 */
export function adjustScariness(text: string, ageGroup: AgeGroup): string {
  const intensity = getContentIntensity(ageGroup)
  
  // Replace scary words with milder alternatives for younger ages
  const scaryWordReplacements: Record<AgeGroup, Record<string, string>> = {
    age_5_7: {
      'terrifying': 'scary',
      'frightening': 'a little scary',
      'monster': 'creature',
      'attack': 'chase',
      'dangerous': 'tricky',
    },
    age_8_10: {
      'terrifying': 'frightening',
      'monster': 'monster',
      'attack': 'challenge',
    },
    age_11_15: {
      // Keep original words for older ages
    },
  }

  let adjustedText = text
  const replacements = scaryWordReplacements[ageGroup] || {}
  
  Object.entries(replacements).forEach(([scary, mild]) => {
    const regex = new RegExp(scary, 'gi')
    adjustedText = adjustedText.replace(regex, mild)
  })

  return adjustedText
}

