#!/bin/bash
# Setup Git authentication for GitHub

echo "🔐 Setting up Git authentication for GitHub"
echo ""
echo "You need a GitHub Personal Access Token (PAT) to push."
echo ""
echo "To create a token:"
echo "1. Go to: https://github.com/settings/tokens"
echo "2. Click 'Generate new token (classic)'"
echo "3. Give it a name (e.g., 'Cursor Git Access')"
echo "4. Select scope: 'repo' (full control of private repositories)"
echo "5. Click 'Generate token'"
echo "6. Copy the token (you won't see it again!)"
echo ""
read -sp "Paste your Personal Access Token here: " token
echo ""

if [ -z "$token" ]; then
    echo "❌ No token provided. Exiting."
    exit 1
fi

# Store token in macOS keychain
echo "💾 Storing token in macOS keychain..."
printf "protocol=https\nhost=github.com\nusername=Bernardtai\npassword=${token}\n" | git credential-osxkeychain store

if [ $? -eq 0 ]; then
    echo "✅ Token stored successfully!"
    echo ""
    echo "Now trying to push..."
    git push origin master
else
    echo "❌ Failed to store token."
    exit 1
fi

