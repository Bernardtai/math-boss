# Profile Page Supabase Integration - Setup Guide

## Overview

The profile page has been fully integrated with Supabase to display real user data from Google OAuth, enable on-screen editing of name and avatar, and show accurate statistics from the database.

## What Was Implemented

### 1. Database Utilities
- **`lib/profile/profile.ts`**: Profile management functions (getOrCreateProfile, updateProfile, uploadAvatar)
- **`lib/profile/stats.ts`**: Statistics calculation functions (getUserStats, getIslandProgress, getUserAchievements)
- **`lib/profile/types.ts`**: TypeScript type definitions for profile data

### 2. Profile Page Features
- Real-time display of Google OAuth user data (name, email, avatar)
- Inline name editing with save/cancel functionality
- Avatar upload to Supabase Storage with progress indicators
- Real statistics calculated from database:
  - Lessons Completed
  - Best Score
  - Time Studied (in minutes)
  - Current Streak
  - Total Points
- Island progress showing real completion data
- Achievements display
- Loading states and error handling

### 3. Authentication Updates
- Removed demo user bypass from AuthGuard
- Proper authentication checks

### 4. Database Verification & Testing
- **`scripts/verify-database.ts`**: Database verification script
- **`scripts/setup-storage.sql`**: SQL script for Supabase Storage setup
- **`scripts/test-database-queries.sql`**: Test queries for verifying calculations

## Setup Instructions

### Step 1: Create the Profiles Table (REQUIRED!)

**If you're getting 404 errors, the profiles table doesn't exist!**

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the SQL script `scripts/create-profiles-table.sql`

This script will:
- Create the `profiles` table with all required columns
- Enable Row Level Security (RLS)
- Create all necessary RLS policies (SELECT, INSERT, UPDATE)
- Set up automatic `updated_at` timestamp updates

**Important**: You must run this script before the profile page will work!

### Step 2: Set Up Supabase Storage

1. Go to your Supabase dashboard
2. Navigate to Storage
3. Run the SQL script `scripts/setup-storage.sql` in the SQL Editor to create the `avatars` bucket and set up policies

Alternatively, manually:
- Create a new bucket named `avatars`
- Set it to public
- Configure policies for authenticated users to upload/update/delete their own avatars

### Step 3: Verify Database Schema

Ensure your database has the following tables with the correct schema:

**Required Tables:**
- `profiles` (id, email, full_name, country, date_of_birth, avatar_url, created_at, updated_at)
- `user_progress` (id, user_id, level_id, score, time_taken, completed_at, attempts, is_boss_level)
- `learning_streaks` (id, user_id, current_streak, longest_streak, last_activity_date, updated_at)
- `user_achievements` (id, user_id, achievement_id, earned_at, progress_value)
- `lessons` (id, name, description, icon_url, color_theme, order_index, created_at)
- `levels` (id, lesson_id, name, level_type, unlock_requirements, question_count, time_limit, created_at)

**RLS Policies:**
- Profiles: Users can view and update their own profile
- User Progress: Users can view, insert, and update their own progress
- Learning Streaks: Users can view and update their own streaks
- User Achievements: Users can view their own achievements

See `docs/PRP_01_Authentication_System.md` for complete schema details.

### Step 4: Test the Implementation

1. **Run Database Verification:**
   ```bash
   # Make sure you have tsx installed
   npm install -g tsx
   # Or use npx
   npx tsx scripts/verify-database.ts
   ```

2. **Test with a Real User:**
   - Sign in with Google OAuth
   - Navigate to `/profile`
   - Verify that your Google profile data (name, avatar) displays
   - Test editing your name
   - Test uploading a new avatar
   - Verify statistics show correctly (will be 0 if no progress data exists)

3. **Test Database Queries:**
   - Run queries from `scripts/test-database-queries.sql` in Supabase SQL Editor
   - Replace `USER_ID` with an actual user ID from your `auth.users` table

## Features

### Profile Display
- Shows Google OAuth profile picture and name
- Displays email, country (if set), and age (if date_of_birth is set)
- Shows total points badge

### Name Editing
- Click the edit icon next to your name
- Enter new name in the input field
- Click save (checkmark) or cancel (X)
- Changes are saved to the database immediately

### Avatar Upload
- Click the plus icon on the avatar
- Select an image file (max 5MB)
- Image is uploaded to Supabase Storage
- Avatar URL is updated in the database
- New avatar displays immediately

### Statistics
All statistics are calculated from real database data:
- **Lessons Completed**: Count of distinct level_ids in user_progress
- **Best Score**: Maximum score from user_progress
- **Time Studied**: Sum of time_taken converted to minutes
- **Current Streak**: From learning_streaks table
- **Total Points**: Sum of all scores from user_progress

### Island Progress
- Shows progress for each lesson/island
- Displays completed levels vs total levels
- Progress bar shows percentage completion
- Data is calculated from user_progress joined with lessons and levels

### Achievements
- Displays earned achievements from user_achievements table
- Shows achievement name, description, and earned date
- Empty state with call-to-action if no achievements

## Error Handling

The profile page includes comprehensive error handling:
- Loading states while fetching data
- Error messages if authentication fails
- Error messages if profile data cannot be loaded
- Validation for avatar uploads (file type, size)
- User-friendly error messages for all operations

## Next Steps

1. **Add Test Data** (optional):
   - Insert sample progress data to test statistics calculations
   - Create test achievements to verify achievement display

2. **Customize Island Names**:
   - Update the lessons table with proper island names
   - Ensure order_index is set correctly for display order

3. **Enhance Achievements**:
   - Create an achievements table with achievement definitions
   - Join user_achievements with achievements table to show full details

4. **Add Recent Activity**:
   - Implement recent activity tracking
   - Display recent lesson completions and achievements

## Troubleshooting

### Profile Not Loading / Profile Creation Failing
- **Most common issue**: Missing INSERT policy on profiles table
  - Run `scripts/fix-profile-rls.sql` in Supabase SQL Editor
  - This adds the policy: "Users can insert own profile"
- Check that user is authenticated
- Verify profiles table exists and has correct schema
- Check browser console for detailed error messages
- Verify RLS policies allow user to:
  - SELECT their own profile
  - INSERT their own profile (this is often missing!)
  - UPDATE their own profile

### Avatar Upload Failing
- Verify `avatars` storage bucket exists and is public
- Check storage policies allow authenticated uploads
- Verify file size is under 5MB
- Check file is a valid image format

### Statistics Showing Zero
- Verify user_progress table has data for the user
- Check that level_id references are correct
- Verify RLS policies allow reading user_progress

### Island Progress Not Showing
- Verify lessons and levels tables have data
- Check that level.lesson_id references lesson.id correctly
- Ensure user_progress.level_id references level.id

## Files Modified/Created

### New Files
- `lib/profile/profile.ts` - Profile management utilities
- `lib/profile/stats.ts` - Statistics calculation utilities
- `lib/profile/types.ts` - Type definitions
- `components/ui/input.tsx` - Input component for name editing
- `scripts/verify-database.ts` - Database verification script
- `scripts/setup-storage.sql` - Storage setup SQL
- `scripts/test-database-queries.sql` - Test queries

### Modified Files
- `app/profile/page.tsx` - Complete rewrite with real data integration
- `components/auth/AuthGuard.tsx` - Removed demo user bypass

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify database schema matches requirements
3. Test database queries manually in Supabase SQL Editor
4. Verify environment variables are set correctly
5. Check Supabase logs for server-side errors

