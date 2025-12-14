#!/usr/bin/env tsx
/**
 * Database Verification Script
 * Checks if required tables, columns, and RLS policies exist in Supabase
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface VerificationResult {
  table: string
  exists: boolean
  columns?: string[]
  rlsEnabled?: boolean
  policies?: string[]
}

async function verifyTable(tableName: string): Promise<VerificationResult> {
  const result: VerificationResult = {
    table: tableName,
    exists: false,
  }

  try {
    // Try to query the table (will fail if it doesn't exist)
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(0)

    if (error) {
      if (error.code === '42P01') {
        // Table does not exist
        result.exists = false
        return result
      }
      throw error
    }

    result.exists = true

    // Get column information
    const { data: columns, error: colError } = await supabase.rpc('get_table_columns', {
      table_name: tableName,
    })

    if (!colError && columns) {
      result.columns = columns.map((col: any) => col.column_name)
    }

    // Check RLS status
    const { data: rlsData, error: rlsError } = await supabase.rpc('check_rls_enabled', {
      table_name: tableName,
    })

    if (!rlsError && rlsData !== undefined) {
      result.rlsEnabled = rlsData as boolean
    }

    // Get policies (if RLS is enabled)
    if (result.rlsEnabled) {
      const { data: policies, error: policyError } = await supabase.rpc('get_table_policies', {
        table_name: tableName,
      })

      if (!policyError && policies) {
        result.policies = policies.map((p: any) => p.policyname)
      }
    }
  } catch (error: any) {
    console.error(`Error verifying table ${tableName}:`, error.message)
  }

  return result
}

async function verifyDatabase() {
  console.log('🔍 Verifying database schema...\n')

  const requiredTables = [
    'profiles',
    'user_progress',
    'learning_streaks',
    'user_achievements',
    'lessons',
    'levels',
  ]

  const results: VerificationResult[] = []

  for (const table of requiredTables) {
    const result = await verifyTable(table)
    results.push(result)
  }

  // Print results
  console.log('📊 Verification Results:\n')
  let allPassed = true

  for (const result of results) {
    if (result.exists) {
      console.log(`✅ ${result.table}`)
      if (result.columns) {
        console.log(`   Columns: ${result.columns.join(', ')}`)
      }
      if (result.rlsEnabled !== undefined) {
        console.log(`   RLS: ${result.rlsEnabled ? '✅ Enabled' : '❌ Disabled'}`)
      }
      if (result.policies && result.policies.length > 0) {
        console.log(`   Policies: ${result.policies.join(', ')}`)
      }
    } else {
      console.log(`❌ ${result.table} - TABLE MISSING`)
      allPassed = false
    }
    console.log('')
  }

  if (!allPassed) {
    console.log('⚠️  Some tables are missing. Please run the migration script.')
    console.log('See docs/PRP_01_Authentication_System.md for schema details.')
    process.exit(1)
  } else {
    console.log('✅ All required tables exist!')
  }
}

// Run verification
verifyDatabase().catch((error) => {
  console.error('❌ Verification failed:', error)
  process.exit(1)
})

