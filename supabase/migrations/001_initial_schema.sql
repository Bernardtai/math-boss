-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles (extends Supabase auth.users)
-- Note: This may already exist from auth system, but we ensure it's correct
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  country TEXT,
  date_of_birth DATE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lessons table - 6 math islands
CREATE TABLE IF NOT EXISTS public.lessons (
  id TEXT PRIMARY KEY, -- 'bodmas', 'grid_method', 'fractions', 'decimals', 'percentages', 'algebra'
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  color_theme TEXT, -- for island theming
  order_index INTEGER NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Levels table - regular and boss levels for each lesson
CREATE TABLE IF NOT EXISTS public.levels (
  id TEXT PRIMARY KEY, -- 'bodmas_level_1', 'bodmas_boss_1', etc.
  lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  level_type TEXT NOT NULL CHECK (level_type IN ('regular', 'boss_1', 'boss_2')),
  order_index INTEGER NOT NULL,
  unlock_requirements JSONB, -- {"required_levels": ["bodmas_level_1"], "min_score": 80}
  question_count INTEGER NOT NULL DEFAULT 10, -- 10 for regular, 25 for boss
  time_limit INTEGER, -- in seconds, null for no limit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(lesson_id, order_index)
);

-- User progress tracking
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  level_id TEXT REFERENCES public.levels(id) ON DELETE CASCADE NOT NULL,
  score INTEGER DEFAULT 0,
  time_taken INTEGER, -- in seconds
  questions_answered INTEGER DEFAULT 0,
  questions_correct INTEGER DEFAULT 0,
  questions_wrong INTEGER DEFAULT 0,
  passed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_boss_level BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, level_id)
);

-- User unlock status - tracks which levels are unlocked for each user
CREATE TABLE IF NOT EXISTS public.user_unlocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  level_id TEXT REFERENCES public.levels(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, level_id)
);

-- Question sessions - tracks each game session
CREATE TABLE IF NOT EXISTS public.question_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  level_id TEXT REFERENCES public.levels(id) ON DELETE CASCADE NOT NULL,
  session_started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_completed_at TIMESTAMP WITH TIME ZONE,
  total_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  wrong_answers INTEGER DEFAULT 0,
  total_time INTEGER DEFAULT 0, -- in seconds
  passed BOOLEAN DEFAULT FALSE
);

-- Individual questions in a session - stores each question and answer
CREATE TABLE IF NOT EXISTS public.session_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.question_sessions(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  user_answer TEXT,
  is_correct BOOLEAN,
  time_taken INTEGER, -- in seconds for this question
  question_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_levels_lesson_id ON public.levels(lesson_id);
CREATE INDEX IF NOT EXISTS idx_levels_order ON public.levels(lesson_id, order_index);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_level_id ON public.user_progress(level_id);
CREATE INDEX IF NOT EXISTS idx_user_unlocks_user_id ON public.user_unlocks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_unlocks_level_id ON public.user_unlocks(level_id);
CREATE INDEX IF NOT EXISTS idx_question_sessions_user_id ON public.question_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_question_sessions_level_id ON public.question_sessions(level_id);
CREATE INDEX IF NOT EXISTS idx_session_questions_session_id ON public.session_questions(session_id);

