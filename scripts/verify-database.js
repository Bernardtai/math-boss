// Simple Node.js script to verify database setup
// Run with: node scripts/verify-database.js

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Read .env.local file
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local')
  if (!fs.existsSync(envPath)) {
    throw new Error('.env.local file not found')
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8')
  const env = {}
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=')
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim()
      }
    }
  })
  
  return env
}

const env = loadEnv()

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  console.error('Please make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyDatabase() {
  console.log('🔍 Verifying database setup...\n')
  
  const results = {
    lessonsTable: false,
    levelsTable: false,
    lessonsCount: 0,
    levelsCount: 0,
    errors: [],
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
      console.log('   This means the migrations haven\'t been run yet.')
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
      console.log('   This means the migrations haven\'t been run yet.')
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
      console.log('\n❌ Database setup is incomplete.')
      console.log('\n📝 To fix this, run the SQL migration:')
      console.log('   1. Go to https://supabase.com/dashboard')
      console.log('   2. Select your project')
      console.log('   3. Go to SQL Editor')
      console.log('   4. Open: supabase/migrations/000_complete_setup.sql')
      console.log('   5. Copy all contents and paste into SQL Editor')
      console.log('   6. Click Run')
      if (results.errors.length > 0) {
        console.log('\nErrors:')
        results.errors.forEach(err => console.log(`  - ${err}`))
      }
      return false
    }
  } catch (error) {
    console.error('❌ Verification failed:', error.message)
    return false
  }
}

verifyDatabase().then(success => {
  process.exit(success ? 0 : 1)
})

