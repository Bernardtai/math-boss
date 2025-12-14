#!/bin/bash
# Force Git to use new authentication

echo "🔧 Forcing Git to forget old credentials..."
echo ""

# Clear all possible credential caches
printf "protocol=https\nhost=github.com\n\n" | git credential reject

# Try to push - this will prompt for NEW credentials
echo "📤 Attempting push (will prompt for credentials)..."
echo ""
echo "When prompted:"
echo "  Username: Bernardtai"
echo "  Password: [Your Personal Access Token]"
echo ""
echo "Get token at: https://github.com/settings/tokens"
echo ""

git push origin master
