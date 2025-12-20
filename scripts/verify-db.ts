import { createClient } from '@/lib/supabase/client'

async function verifyDatabase() {
  console.log('🔍 Verifying database setup...\n')
  
  const supabase = createClient()
  const results = {
    lessonsTable: false,
    levelsTable: false,
    lessonsCount: 0,
    levelsCount: 0,
    errors: [] as string[],
  }

  try {
    // Check lessons table
    console.log('Checking lessons table...')
    const { data: lessons, error: lessonsError, count: lessonsCount } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })

    if (lessonsError) {
      results.errors.push(`Lessons table error: ${lessonsError.message}`)
      console.log('❌ Lessons table not found or error:', lessonsError.message)
    } else {
      results.lessonsTable = true
      results.lessonsCount = lessonsCount || 0
      console.log(`✅ Lessons table exists with ${results.lessonsCount} records`)
    }

    // Check levels table
    console.log('Checking levels table...')
    const { data: levels, error: levelsError, count: levelsCount } = await supabase
      .from('levels')
      .select('*', { count: 'exact', head: true })

    if (levelsError) {
      results.errors.push(`Levels table error: ${levelsError.message}`)
      console.log('❌ Levels table not found or error:', levelsError.message)
    } else {
      results.levelsTable = true
      results.levelsCount = levelsCount || 0
      console.log(`✅ Levels table exists with ${levelsCount} records`)
    }

    // Summary
    console.log('\n📊 Summary:')
    console.log(`  Lessons: ${results.lessonsCount}/6 ${results.lessonsCount === 6 ? '✅' : '❌'}`)
    console.log(`  Levels: ${results.levelsCount}/42 ${results.levelsCount >= 40 ? '✅' : '❌'}`)

    if (results.lessonsTable && results.levelsTable && results.lessonsCount === 6 && results.levelsCount >= 40) {
      console.log('\n✅ Database setup is complete!')
      return true
    } else {
      console.log('\n❌ Database setup is incomplete. Please run migrations.')
      if (results.errors.length > 0) {
        console.log('\nErrors:')
        results.errors.forEach(err => console.log(`  - ${err}`))
      }
      return false
    }
  } catch (error) {
    console.error('❌ Verification failed:', error)
    return false
  }
}

// Run if called directly
if (require.main === module) {
  verifyDatabase().then(success => {
    process.exit(success ? 0 : 1)
  })
}

export { verifyDatabase }

