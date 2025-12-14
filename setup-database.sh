#!/bin/bash

# Script to set up the database schema and seed data
# This script will help you apply migrations to your Supabase database

echo "🚀 Setting up Boss Math Database..."
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed."
    echo "Please install it first:"
    echo "  npm install -g supabase"
    echo "  or"
    echo "  brew install supabase/tap/supabase"
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Check if user is logged in
echo "Checking Supabase login status..."
if ! supabase projects list &> /dev/null; then
    echo "⚠️  You need to login to Supabase first."
    echo "Run: supabase login"
    exit 1
fi

echo "✅ Logged in to Supabase"
echo ""

# Check if linked to a project
if [ ! -f ".supabase/config.toml" ] && [ ! -f "supabase/.temp/project-ref" ]; then
    echo "⚠️  Not linked to a Supabase project."
    echo ""
    echo "You have two options:"
    echo ""
    echo "Option 1: Link to remote project (recommended)"
    echo "  supabase link --project-ref YOUR_PROJECT_REF"
    echo ""
    echo "Option 2: Run migrations manually in Supabase Dashboard"
    echo "  1. Go to https://supabase.com/dashboard"
    echo "  2. Select your project"
    echo "  3. Go to SQL Editor"
    echo "  4. Run the SQL files in order:"
    echo "     - supabase/migrations/001_initial_schema.sql"
    echo "     - supabase/migrations/002_seed_lessons.sql"
    echo "     - supabase/migrations/003_rls_policies.sql"
    echo ""
    exit 1
fi

echo "📦 Applying migrations..."
echo ""

# Try to push migrations
if supabase db push; then
    echo ""
    echo "✅ Database setup complete!"
    echo ""
    echo "Your database now has:"
    echo "  - All required tables (lessons, levels, user_progress, etc.)"
    echo "  - 6 lessons seeded"
    echo "  - 42 levels seeded (36 regular + 12 boss)"
    echo "  - Row Level Security policies configured"
    echo ""
else
    echo ""
    echo "❌ Failed to push migrations."
    echo ""
    echo "Alternative: Run migrations manually in Supabase Dashboard"
    echo "  1. Go to https://supabase.com/dashboard"
    echo "  2. Select your project"
    echo "  3. Go to SQL Editor"
    echo "  4. Copy and paste each migration file in order:"
    echo "     - supabase/migrations/001_initial_schema.sql"
    echo "     - supabase/migrations/002_seed_lessons.sql"
    echo "     - supabase/migrations/003_rls_policies.sql"
    echo ""
fi

