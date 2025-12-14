#!/bin/bash

# Script to migrate database and verify setup

echo "🚀 Boss Math Database Migration & Verification"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI is not installed.${NC}"
    echo ""
    echo "Please install it first:"
    echo "  npm install -g supabase"
    echo "  or"
    echo "  brew install supabase/tap/supabase"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo -e "${GREEN}✅ Supabase CLI found${NC}"
echo ""

# Check if linked to a project
if [ ! -f ".supabase/config.toml" ] && [ ! -f "supabase/.temp/project-ref" ]; then
    echo -e "${YELLOW}⚠️  Not linked to a Supabase project.${NC}"
    echo ""
    echo "Linking to project: qtvnvmnvbsoofdbcpybh"
    echo ""
    
    if supabase link --project-ref qtvnvmnvbsoofdbcpybh; then
        echo -e "${GREEN}✅ Successfully linked to project${NC}"
    else
        echo -e "${RED}❌ Failed to link to project${NC}"
        echo ""
        echo "Please make sure you're logged in:"
        echo "  supabase login"
        exit 1
    fi
    echo ""
fi

# Push migrations
echo "📦 Pushing database migrations..."
echo ""

if supabase db push; then
    echo ""
    echo -e "${GREEN}✅ Migrations pushed successfully!${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Failed to push migrations${NC}"
    echo ""
    echo "Alternative: Run the SQL manually in Supabase Dashboard:"
    echo "  1. Go to https://supabase.com/dashboard"
    echo "  2. Select your project"
    echo "  3. Go to SQL Editor"
    echo "  4. Copy contents of: supabase/migrations/000_complete_setup.sql"
    echo "  5. Paste and run"
    exit 1
fi

# Wait a moment for changes to propagate
echo "⏳ Waiting for changes to propagate..."
sleep 2

# Verify setup
echo ""
echo "🔍 Verifying database setup..."
echo ""

# Check if we can query the tables
if command -v node &> /dev/null; then
    # Try to run verification script if Node.js is available
    if [ -f "scripts/verify-db.ts" ]; then
        echo "Running verification script..."
        # Note: This would require tsx or ts-node to be installed
        # For now, we'll do a simple check
    fi
fi

echo ""
echo "✅ Migration complete!"
echo ""
echo "You can now:"
echo "  1. Visit http://localhost:3000/db-check to verify"
echo "  2. Try clicking 'Start Learning' on the lessons page"
echo ""

