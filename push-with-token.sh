#!/bin/bash
# Push to GitHub with Personal Access Token

echo "🚀 Pushing to GitHub..."
echo ""
echo "If you have a Personal Access Token ready, enter it below."
echo "Otherwise, press Ctrl+C and create one at:"
echo "https://github.com/settings/tokens"
echo ""
read -sp "Enter your Personal Access Token: " token
echo ""

if [ -z "$token" ]; then
    echo "❌ No token provided. Exiting."
    exit 1
fi

# Temporarily set remote with token
git remote set-url origin https://Bernardtai:${token}@github.com/Bernardtai/math-boss.git

echo "📤 Pushing to origin/master..."
if git push origin master; then
    echo "✅ Push successful!"
    # Remove token from URL for security
    git remote set-url origin https://github.com/Bernardtai/math-boss.git
    echo "🔒 Token removed from URL (saved in keychain)"
else
    echo "❌ Push failed. Token may be invalid or expired."
    # Restore original URL
    git remote set-url origin https://github.com/Bernardtai/math-boss.git
    exit 1
fi
