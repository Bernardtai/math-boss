#!/bin/bash

# Script to update Supabase configuration
# Run this after you get your Supabase credentials

echo "Please provide your Supabase credentials:"
echo "1. Your Supabase project URL (e.g., https://abcdefghijklmnop.supabase.co):"
read -r SUPABASE_URL

echo "2. Your Supabase anon key (starts with eyJ...):"
read -r SUPABASE_ANON_KEY

echo "3. Your Supabase service role key (starts with eyJ...):"
read -r SUPABASE_SERVICE_KEY

echo "4. Your Supabase project ID:"
read -r SUPABASE_PROJECT_ID

# Update .env.local file
cat > .env.local << EOF
# Supabase Configuration - Updated $(date)
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_KEY}
SUPABASE_PROJECT_ID=${SUPABASE_PROJECT_ID}

# Google OAuth Configuration
# Note: Add your Google OAuth credentials here when needed
# GOOGLE_CLIENT_ID=your_google_client_id_here
# GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Development Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3020
EOF

echo "✅ Supabase configuration updated!"
echo "You can now run 'npm run dev' to start your development server."
