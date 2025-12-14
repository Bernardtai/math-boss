-- Test Database Queries
-- Run these queries in Supabase SQL editor to test and verify calculations

-- 1. Test profile creation and retrieval
-- First, get a test user ID from auth.users
SELECT id, email FROM auth.users LIMIT 1;

-- Create a test profile (replace USER_ID with actual user ID)
-- INSERT INTO public.profiles (id, email, full_name, avatar_url)
-- VALUES ('USER_ID', 'test@example.com', 'Test User', 'https://example.com/avatar.jpg')
-- ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

-- 2. Test user progress queries
-- Get lessons completed count for a user
SELECT COUNT(DISTINCT level_id) as lessons_completed
FROM public.user_progress
WHERE user_id = 'USER_ID';

-- Get best score for a user
SELECT MAX(score) as best_score
FROM public.user_progress
WHERE user_id = 'USER_ID';

-- Get total time studied (in seconds)
SELECT COALESCE(SUM(time_taken), 0) as total_time_seconds
FROM public.user_progress
WHERE user_id = 'USER_ID';

-- Get current streak
SELECT current_streak
FROM public.learning_streaks
WHERE user_id = 'USER_ID';

-- 3. Test island progress query
SELECT 
  l.id as lesson_id,
  l.name as lesson_name,
  COUNT(DISTINCT lev.id) as total_levels,
  COUNT(DISTINCT up.level_id) as completed_levels,
  CASE 
    WHEN COUNT(DISTINCT lev.id) > 0 
    THEN ROUND((COUNT(DISTINCT up.level_id)::numeric / COUNT(DISTINCT lev.id)::numeric) * 100, 2)
    ELSE 0 
  END as progress_percentage
FROM public.lessons l
LEFT JOIN public.levels lev ON lev.lesson_id = l.id
LEFT JOIN public.user_progress up ON up.level_id = lev.id AND up.user_id = 'USER_ID'
GROUP BY l.id, l.name
ORDER BY l.order_index;

-- 4. Test achievements query
SELECT 
  ua.id,
  ua.achievement_id,
  ua.earned_at,
  ua.progress_value
FROM public.user_achievements ua
WHERE ua.user_id = 'USER_ID'
ORDER BY ua.earned_at DESC;

-- 5. Insert test progress data (for testing)
-- Make sure you have lessons and levels created first
-- INSERT INTO public.user_progress (user_id, level_id, score, time_taken, completed_at)
-- VALUES 
--   ('USER_ID', 'LEVEL_ID_1', 85, 120, NOW()),
--   ('USER_ID', 'LEVEL_ID_2', 90, 110, NOW());

-- 6. Insert test streak data
-- INSERT INTO public.learning_streaks (user_id, current_streak, longest_streak, last_activity_date)
-- VALUES ('USER_ID', 5, 10, CURRENT_DATE)
-- ON CONFLICT (user_id) DO UPDATE SET 
--   current_streak = EXCLUDED.current_streak,
--   last_activity_date = EXCLUDED.last_activity_date;

-- 7. Verify RLS policies
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'user_progress', 'learning_streaks', 'user_achievements');

-- Check policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'user_progress', 'learning_streaks', 'user_achievements');

