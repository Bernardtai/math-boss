#!/bin/bash

# Vercel Deployment Script for Math Boss
# This script helps you prepare and deploy to Vercel

set -e

echo "🚀 Math Boss - Vercel Deployment Helper"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Are you in the project root?${NC}"
    exit 1
fi

echo "📋 Pre-deployment Checklist:"
echo ""

# Check git status
echo "1. Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}   ⚠️  You have uncommitted changes${NC}"
    echo "   Current changes:"
    git status --short
    echo ""
    read -p "   Do you want to commit these changes? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "   Enter commit message: " commit_msg
        git add .
        git commit -m "$commit_msg"
        echo -e "${GREEN}   ✅ Changes committed${NC}"
    fi
else
    echo -e "${GREEN}   ✅ Working tree is clean${NC}"
fi

# Check if remote exists
echo ""
echo "2. Checking git remote..."
if git remote -v | grep -q "origin"; then
    REMOTE_URL=$(git remote get-url origin)
    echo -e "${GREEN}   ✅ Git remote configured: $REMOTE_URL${NC}"
else
    echo -e "${RED}   ❌ No git remote found${NC}"
    exit 1
fi

# Check Node version
echo ""
echo "3. Checking Node.js version..."
NODE_VERSION=$(node -v)
echo -e "${GREEN}   ✅ Node.js version: $NODE_VERSION${NC}"

# Run tests
echo ""
echo "4. Running linter..."
if npm run lint > /dev/null 2>&1; then
    echo -e "${GREEN}   ✅ Linter passed${NC}"
else
    echo -e "${YELLOW}   ⚠️  Linter warnings found (continuing anyway)${NC}"
fi

# Try to build
echo ""
echo "5. Testing build locally..."
echo "   This may take a minute..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}   ✅ Build successful${NC}"
else
    echo -e "${RED}   ❌ Build failed. Please fix errors before deploying.${NC}"
    echo "   Run 'npm run build' to see the errors"
    exit 1
fi

# Check Vercel CLI
echo ""
echo "6. Checking Vercel CLI..."
if command -v vercel &> /dev/null; then
    echo -e "${GREEN}   ✅ Vercel CLI installed${NC}"
    
    # Try to check login status
    if vercel whoami &> /dev/null; then
        VERCEL_USER=$(vercel whoami 2>/dev/null || echo "unknown")
        echo -e "${GREEN}   ✅ Logged in as: $VERCEL_USER${NC}"
        VERCEL_READY=true
    else
        echo -e "${YELLOW}   ⚠️  Not logged in to Vercel${NC}"
        VERCEL_READY=false
    fi
else
    echo -e "${YELLOW}   ⚠️  Vercel CLI not installed${NC}"
    VERCEL_READY=false
fi

echo ""
echo "========================================"
echo ""

# Deployment options
if [ "$VERCEL_READY" = true ]; then
    echo "🎯 Ready to deploy!"
    echo ""
    echo "Choose deployment method:"
    echo "1. Push to GitHub (triggers automatic Vercel deployment if configured)"
    echo "2. Deploy with Vercel CLI"
    echo "3. Show deployment instructions and exit"
    echo "4. Exit without deploying"
    echo ""
    read -p "Enter your choice (1-4): " -n 1 -r
    echo
    echo ""

    case $REPLY in
        1)
            echo "🔄 Pushing to GitHub..."
            git push origin $(git branch --show-current)
            echo ""
            echo -e "${GREEN}✅ Pushed to GitHub!${NC}"
            echo ""
            echo "If Vercel is connected to your GitHub repo, deployment will start automatically."
            echo "Check your Vercel dashboard: https://vercel.com/dashboard"
            ;;
        2)
            echo "🚀 Deploying to Vercel..."
            vercel --prod
            echo ""
            echo -e "${GREEN}✅ Deployment complete!${NC}"
            ;;
        3)
            cat VERCEL_DEPLOYMENT.md
            ;;
        4)
            echo "👋 Exiting without deploying"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice${NC}"
            exit 1
            ;;
    esac
else
    echo "📖 Vercel CLI not ready. Here are your options:"
    echo ""
    echo "Option 1: Deploy via Vercel Dashboard (Recommended)"
    echo "  1. Go to https://vercel.com/new"
    echo "  2. Import your GitHub repository: Bernardtai/math-boss"
    echo "  3. Configure environment variables"
    echo "  4. Click Deploy"
    echo ""
    echo "Option 2: Use Vercel CLI"
    echo "  1. Login: vercel login"
    echo "  2. Deploy: vercel --prod"
    echo ""
    echo "Option 3: Push to GitHub (if already connected)"
    echo "  1. git push origin $(git branch --show-current)"
    echo ""
    echo "For detailed instructions, see: VERCEL_DEPLOYMENT.md"
    echo ""
    
    read -p "Do you want to push to GitHub now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🔄 Pushing to GitHub..."
        git push origin $(git branch --show-current)
        echo ""
        echo -e "${GREEN}✅ Pushed to GitHub!${NC}"
        echo ""
        echo "If Vercel is connected to your repo, deployment will start automatically."
        echo "Otherwise, follow the instructions in VERCEL_DEPLOYMENT.md"
    fi
fi

echo ""
echo "📚 For more help, see: VERCEL_DEPLOYMENT.md"
echo "🌐 GitHub repo: https://github.com/Bernardtai/math-boss"
echo ""
echo "✨ Happy deploying! ✨"

