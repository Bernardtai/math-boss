#!/bin/bash
# Helper script to push to GitHub with Personal Access Token

echo "🔐 GitHub Push Helper"
echo ""
echo "Option 1: If you have a Personal Access Token"
echo "──────────────────────────────────────────────"
read -p "Enter your Personal Access Token: " token
if [ ! -z "$token" ]; then
    git remote set-url origin https://Bernardtai:${token}@github.com/Bernardtai/math-boss.git
    echo "✓ Remote configured"
    echo "Pushing to GitHub..."
    git push origin master
    # Remove token from URL for security
    git remote set-url origin https://github.com/Bernardtai/math-boss.git
    echo "✓ Push complete! Token removed from URL for security."
    exit 0
fi

echo ""
echo "Option 2: Manual push"
echo "─────────────────────"
echo "Run: git push origin master"
echo "When prompted:"
echo "  Username: Bernardtai"
echo "  Password: [your Personal Access Token]"
