# Database Setup Instructions

The 404 error you're seeing means the database tables haven't been created yet. You need to run the migrations to set up the database schema.

## Option 1: Using Supabase CLI (Recommended)

### Step 1: Install Supabase CLI (if not already installed)
```bash
npm install -g supabase
# or
brew install supabase/tap/supabase
```

### Step 2: Login to Supabase
```bash
supabase login
```

### Step 3: Link to your project
```bash
supabase link --project-ref qtvnvmnvbsoofdbcpybh
```

### Step 4: Push migrations
```bash
supabase db push
```

Or use the setup script:
```bash
./setup-database.sh
```

## Option 2: Manual Setup via Supabase Dashboard

If you prefer to set up manually:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (qtvnvmnvbsoofdbcpybh)
3. Navigate to **SQL Editor**
4. Run each migration file in order:

### Migration 1: Initial Schema
Copy and paste the contents of `supabase/migrations/001_initial_schema.sql` and click **Run**

### Migration 2: Seed Lessons
Copy and paste the contents of `supabase/migrations/002_seed_lessons.sql` and click **Run**

### Migration 3: RLS Policies
Copy and paste the contents of `supabase/migrations/003_rls_policies.sql` and click **Run**

## Verify Setup

After running the migrations, you should have:
- ✅ `lessons` table with 6 lessons
- ✅ `levels` table with 42 levels (36 regular + 12 boss)
- ✅ `user_progress` table for tracking progress
- ✅ `user_unlocks` table for level unlocks
- ✅ All RLS policies configured

You can verify by running:
```bash
npm run db:generate
```

Or check in the Supabase Dashboard under **Table Editor**.

## Troubleshooting

### If you get "project not found"
- Make sure you're logged in: `supabase login`
- Check your project reference is correct
- Verify your Supabase URL in `.env.local` matches your project

### If migrations fail
- Check the SQL Editor in Supabase Dashboard for error messages
- Make sure you run migrations in order (001, 002, 003)
- Some tables might already exist from auth setup - that's okay, the migrations use `CREATE TABLE IF NOT EXISTS`

