#!/bin/bash

# Fix Redirect Loop - Deploy Cookie Handling Fixes
set -e

echo "🔧 Fixing Redirect Loop Issue"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "📋 Changes Made:"
echo "  ✅ Updated auth callback cookie handling"
echo "  ✅ Fixed middleware cookie settings"
echo "  ✅ Added /api/auth path exclusion"
echo ""

echo -e "${YELLOW}⚠️  IMPORTANT: Before deploying, verify these settings in Supabase Dashboard:${NC}"
echo ""
echo "1. Go to: https://supabase.com/dashboard"
echo "2. Select your project"
echo "3. Go to Authentication → URL Configuration"
echo ""
echo "4. Verify these settings:"
echo "   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   Site URL: https://YOUR-VERCEL-URL.vercel.app"
echo "   "
echo "   Redirect URLs (add both):"
echo "     • http://localhost:3000/api/auth/callback"
echo "     • https://YOUR-VERCEL-URL.vercel.app/api/auth/callback"
echo "   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

read -p "Have you verified your Supabase URL settings? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ Please update Supabase settings first, then run this script again.${NC}"
    exit 1
fi

echo ""
echo "🚀 Step 1: Committing Changes"
echo "=============================="
git add app/api/auth/callback/route.ts lib/supabase/middleware.ts
git commit -m "fix: resolve redirect loop with proper cookie handling in production"

echo ""
echo "🚀 Step 2: Pushing to GitHub"
echo "============================"
git push origin master

echo ""
echo "🚀 Step 3: Deploying to Vercel"
echo "==============================="
echo "Vercel will automatically deploy from GitHub push..."
echo "Or run: vercel --prod"
echo ""

read -p "Deploy to Vercel now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    vercel --prod
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✨ Deploy Complete! ✨${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "🧪 Testing Steps:"
echo "  1. Clear your browser cookies for your site"
echo "  2. Go to your production URL"
echo "  3. Click 'Sign in with Google'"
echo "  4. You should be redirected to /dashboard without loops"
echo ""
echo "🔍 If still having issues, check:"
echo "  • Browser Developer Console (F12) for errors"
echo "  • Vercel deployment logs"
echo "  • Supabase Auth logs"
echo ""

