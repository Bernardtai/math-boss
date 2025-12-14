-- Enable Row Level Security on new tables
ALTER TABLE public.learning_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can read own streaks" ON public.learning_streaks;
DROP POLICY IF EXISTS "Users can insert own streaks" ON public.learning_streaks;
DROP POLICY IF EXISTS "Users can update own streaks" ON public.learning_streaks;
DROP POLICY IF EXISTS "Users can read own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Users can insert own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Users can update own achievements" ON public.user_achievements;

-- Learning streaks policies
-- Users can only read their own streaks
CREATE POLICY "Users can read own streaks" ON public.learning_streaks
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own streaks
CREATE POLICY "Users can insert own streaks" ON public.learning_streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own streaks
CREATE POLICY "Users can update own streaks" ON public.learning_streaks
  FOR UPDATE USING (auth.uid() = user_id);

-- User achievements policies
-- Users can only read their own achievements
CREATE POLICY "Users can read own achievements" ON public.user_achievements
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own achievements
CREATE POLICY "Users can insert own achievements" ON public.user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own achievements
CREATE POLICY "Users can update own achievements" ON public.user_achievements
  FOR UPDATE USING (auth.uid() = user_id);

