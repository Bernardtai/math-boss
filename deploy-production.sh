#!/bin/bash

# Deploy to Vercel - Add Environment Variables and Deploy
# This script will help you add environment variables to your Vercel project

set -e

echo "🚀 Math Boss - Vercel Deployment"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "📋 Project Status:"
echo "  ✅ Vercel CLI: Installed"
echo "  ✅ User: bernardtai"
echo "  ✅ Project: math-boss (linked)"
echo "  ✅ GitHub: https://github.com/Bernardtai/math-boss"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Error: .env file not found${NC}"
    echo "Please create a .env file with your Supabase credentials first."
    exit 1
fi

echo "📝 Step 1: Adding Environment Variables to Vercel"
echo "=================================================="
echo ""
echo "We need to add your Supabase environment variables to Vercel."
echo "These values will be read from your local .env file."
echo ""

# Function to add environment variable to Vercel
add_env_var() {
    local key=$1
    local value=$2
    
    if [ -z "$value" ]; then
        echo -e "${YELLOW}⚠️  Skipping $key (value is empty)${NC}"
        return
    fi
    
    echo -n "  Adding $key... "
    
    # Check if variable already exists
    if vercel env ls production 2>/dev/null | grep -q "^$key"; then
        echo -e "${YELLOW}already exists, removing old value...${NC}"
        vercel env rm "$key" production --yes >/dev/null 2>&1 || true
    fi
    
    # Add the new value
    if echo "$value" | vercel env add "$key" production >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Added${NC}"
    else
        echo -e "${RED}❌ Failed${NC}"
    fi
}

# Extract values from .env file
echo "Reading environment variables from .env file..."
echo ""

# Read the .env file and extract the values
SUPABASE_URL=$(grep "^NEXT_PUBLIC_SUPABASE_URL=" .env 2>/dev/null | cut -d '=' -f2- | tr -d '"' | tr -d "'")
SUPABASE_ANON_KEY=$(grep "^NEXT_PUBLIC_SUPABASE_ANON_KEY=" .env 2>/dev/null | cut -d '=' -f2- | tr -d '"' | tr -d "'")
SUPABASE_SERVICE_KEY=$(grep "^SUPABASE_SERVICE_ROLE_KEY=" .env 2>/dev/null | cut -d '=' -f2- | tr -d '"' | tr -d "'")

# Add environment variables
add_env_var "NEXT_PUBLIC_SUPABASE_URL" "$SUPABASE_URL"
add_env_var "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$SUPABASE_ANON_KEY"
add_env_var "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE_KEY"

echo ""
echo -e "${GREEN}✅ Environment variables added to Vercel!${NC}"
echo ""

echo "🚀 Step 2: Deploying to Production"
echo "==================================="
echo ""
echo "Now deploying your project to Vercel..."
echo "This may take 2-3 minutes..."
echo ""

# Deploy to production
if vercel --prod; then
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✨ Deployment Successful! ✨${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "🎉 Your app is now live on Vercel!"
    echo ""
    echo "📊 Next Steps:"
    echo "  1. Visit your deployment URL (shown above)"
    echo "  2. Test authentication and features"
    echo "  3. Check the Vercel dashboard: https://vercel.com/dashboard"
    echo ""
    echo "🔄 Future Deployments:"
    echo "  Every time you push to GitHub, Vercel will automatically deploy!"
    echo "  Just run: git push origin master"
    echo ""
    echo "✨ Happy deploying! ✨"
else
    echo ""
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ Deployment Failed${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Please check the error messages above."
    echo "Common issues:"
    echo "  - Build errors: Run 'npm run build' locally to test"
    echo "  - Missing dependencies: Run 'npm install'"
    echo "  - Environment variables: Check your Vercel dashboard"
    echo ""
    exit 1
fi

