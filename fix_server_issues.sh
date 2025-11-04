#!/bin/bash

echo "🔧 Fixing Math Boss Server Issues"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in the Math Boss project directory"
    echo "Please run this from the '/Users/jayden/Boss Math' directory"
    exit 1
fi

echo "✅ Found package.json"

# Clean up any potential issues
echo "🧹 Cleaning up..."

# Remove any lock files that might be corrupted
if [ -f "package-lock.json" ]; then
    rm package-lock.json
    echo "✅ Removed package-lock.json"
fi

if [ -f "yarn.lock" ]; then
    rm yarn.lock
    echo "✅ Removed yarn.lock"
fi

# Clear Next.js cache
if [ -d ".next" ]; then
    rm -rf .next
    echo "✅ Cleared Next.js cache"
fi

# Clear node_modules if requested
read -p "Do you want to reinstall node_modules? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -rf node_modules
    echo "✅ Removed node_modules"
    echo "📦 Installing dependencies..."
    npm install
else
    echo "⏭️  Skipping node_modules reinstall"
fi

# Fix potential permission issues
echo "🔐 Fixing permissions..."
chmod +x update_supabase_config.sh 2>/dev/null || true
chmod +x diagnose_server.js 2>/dev/null || true

# Check for common issues
echo "🔍 Checking for common issues..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found - this might cause authentication issues"
    echo "   Run: ./update_supabase_config.sh (if you have Supabase credentials)"
else
    echo "✅ .env.local found"
fi

# Check if all required files exist
files=("app/layout.tsx" "app/page.tsx" "app/globals.css" "tailwind.config.js")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done

echo ""
echo "🚀 Ready to test the server!"
echo "Run: npm run dev"
echo ""
echo "If you still get errors, try:"
echo "1. npm run build (to check for build errors)"
echo "2. PORT=3002 npm run dev (to use a different port)"
echo "3. node diagnose_server.js (for detailed diagnostics)"
echo ""
echo "🎉 Server issues should now be resolved!"


