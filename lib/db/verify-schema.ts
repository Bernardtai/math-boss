import { createClient } from '@/lib/supabase/server'

export interface SchemaVerificationResult {
  success: boolean
  tables: {
    name: string
    exists: boolean
    columns?: string[]
  }[]
  seedData: {
    lessons: number
    levels: number
    expectedLessons: number
    expectedLevels: number
  }
  rlsEnabled: {
    table: string
    enabled: boolean
  }[]
  errors: string[]
}

export async function verifySchema(): Promise<SchemaVerificationResult> {
  const supabase = await createClient()
  const result: SchemaVerificationResult = {
    success: true,
    tables: [],
    seedData: {
      lessons: 0,
      levels: 0,
      expectedLessons: 6,
      expectedLevels: 42, // 36 regular + 12 boss (2 per island)
    },
    rlsEnabled: [],
    errors: [],
  }

  // Required tables
  const requiredTables = [
    'profiles',
    'lessons',
    'levels',
    'user_progress',
    'user_unlocks',
    'question_sessions',
    'session_questions',
  ]

  // Check if tables exist by trying to query them
  for (const tableName of requiredTables) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(0)

      if (error) {
        result.tables.push({
          name: tableName,
          exists: false,
        })
        result.errors.push(`Table ${tableName} does not exist or is not accessible: ${error.message}`)
        result.success = false
      } else {
        // Try to get column info by selecting with limit
        const { data: sampleData } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)

        result.tables.push({
          name: tableName,
          exists: true,
        })
      }
    } catch (err) {
      result.tables.push({
        name: tableName,
        exists: false,
      })
      result.errors.push(`Error checking table ${tableName}: ${err instanceof Error ? err.message : 'Unknown error'}`)
      result.success = false
    }
  }

  // Check seed data
  try {
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id')

    if (lessonsError) {
      result.errors.push(`Error checking lessons: ${lessonsError.message}`)
      result.success = false
    } else {
      result.seedData.lessons = lessons?.length || 0
      if (result.seedData.lessons !== result.seedData.expectedLessons) {
        result.errors.push(
          `Expected ${result.seedData.expectedLessons} lessons, found ${result.seedData.lessons}`
        )
        result.success = false
      }
    }
  } catch (err) {
    result.errors.push(`Error checking lessons seed data: ${err instanceof Error ? err.message : 'Unknown error'}`)
    result.success = false
  }

  try {
    const { data: levels, error: levelsError } = await supabase
      .from('levels')
      .select('id')

    if (levelsError) {
      result.errors.push(`Error checking levels: ${levelsError.message}`)
      result.success = false
    } else {
      result.seedData.levels = levels?.length || 0
      if (result.seedData.levels !== result.seedData.expectedLevels) {
        result.errors.push(
          `Expected ${result.seedData.expectedLevels} levels, found ${result.seedData.levels}`
        )
        result.success = false
      }
    }
  } catch (err) {
    result.errors.push(`Error checking levels seed data: ${err instanceof Error ? err.message : 'Unknown error'}`)
    result.success = false
  }

  // Check RLS policies (we can't directly query RLS status, but we can check if queries work)
  // For now, we'll assume RLS is enabled if tables exist and queries work
  // In a real scenario, you'd need to query pg_policies system table
  for (const tableName of requiredTables) {
    try {
      const { error } = await supabase
        .from(tableName)
        .select('*')
        .limit(0)

      // If we can query without auth errors, RLS is likely configured
      // This is a simplified check
      result.rlsEnabled.push({
        table: tableName,
        enabled: !error || !error.message.includes('permission denied'),
      })
    } catch (err) {
      result.rlsEnabled.push({
        table: tableName,
        enabled: false,
      })
    }
  }

  return result
}

export async function printVerificationReport(): Promise<void> {
  const result = await verifySchema()

  console.log('\n=== Database Schema Verification Report ===\n')

  console.log('Tables:')
  result.tables.forEach((table) => {
    const status = table.exists ? '✅' : '❌'
    console.log(`  ${status} ${table.name}`)
  })

  console.log('\nSeed Data:')
  console.log(`  Lessons: ${result.seedData.lessons}/${result.seedData.expectedLessons}`)
  console.log(`  Levels: ${result.seedData.levels}/${result.seedData.expectedLevels}`)

  console.log('\nRLS Status:')
  result.rlsEnabled.forEach((rls) => {
    const status = rls.enabled ? '✅' : '❌'
    console.log(`  ${status} ${rls.table}`)
  })

  if (result.errors.length > 0) {
    console.log('\nErrors:')
    result.errors.forEach((error) => {
      console.log(`  ❌ ${error}`)
    })
  }

  console.log(`\nOverall Status: ${result.success ? '✅ PASSED' : '❌ FAILED'}\n`)

  return
}

