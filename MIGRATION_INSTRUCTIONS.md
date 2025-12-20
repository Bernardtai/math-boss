# Database Migration Instructions

## Current Status
Your database tables haven't been created yet. You need to run the SQL migration.

## Quick Fix (Recommended)

### Option 1: Supabase Dashboard (Easiest - No CLI needed)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project: `qtvnvmnvbsoofdbcpybh`

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Migration**
   - Open the file: `supabase/migrations/000_complete_setup.sql`
   - Copy ALL the contents (entire file)
   - Paste into the SQL Editor
   - Click "Run" button (or press Cmd/Ctrl + Enter)

4. **Verify**
   - You should see "Success" message
   - Visit: http://localhost:3000/db-check to verify
   - Or run: `npm run db:verify`

### Option 2: Supabase CLI (If you prefer command line)

1. **Login to Supabase**
   ```bash
   supabase login
   ```

2. **Link to your project**
   ```bash
   supabase link --project-ref qtvnvmnvbsoofdbcpybh
   ```

3. **Push migrations**
   ```bash
   supabase db push
   ```

4. **Verify**
   ```bash
   npm run db:verify
   ```

## What Gets Created

After running the migration, you'll have:
- ✅ `lessons` table with 6 lessons
- ✅ `levels` table with 42 levels (36 regular + 12 boss)
- ✅ `user_progress` table for tracking progress
- ✅ `user_unlocks` table for level unlocks
- ✅ All security policies configured

## Verification

After migration, verify by:
1. Visit: http://localhost:3000/db-check
2. Or run: `npm run db:verify`

You should see all green checkmarks!

## Troubleshooting

### If you get "table already exists" errors
- That's okay! The migration uses `CREATE TABLE IF NOT EXISTS`
- Just continue - it will skip existing tables

### If you get permission errors
- Make sure you're logged into the correct Supabase account
- Check that you have access to the project

### If verification still fails
- Wait a few seconds for changes to propagate
- Refresh the verification page
- Check the Supabase Dashboard to confirm tables exist

