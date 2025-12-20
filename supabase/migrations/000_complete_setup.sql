-- Complete Database Setup for Boss Math
-- Run this file in Supabase SQL Editor to set up everything at once
-- Or run the individual migration files in order: 001, 002, 003

-- ============================================
-- MIGRATION 001: Initial Schema
-- ============================================

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

-- ============================================
-- MIGRATION 002: Seed Lessons
-- ============================================

-- Seed lessons (6 math islands)
INSERT INTO public.lessons (id, name, description, icon_url, color_theme, order_index) VALUES
  ('bodmas', 'BODMAS Island', 'Master the order of operations in this tropical paradise!', '🏝️', 'bodmas', 1),
  ('grid_method', 'Grid Method Island', 'Fast multiplication techniques', '⊞', 'grid_method', 2),
  ('fractions', 'Fractions Island', 'Mixed operations with fractions', '⅓', 'fractions', 3),
  ('decimals', 'Decimals Island', 'All four operations with decimals', '0.', 'decimals', 4),
  ('percentages', 'Percentages Island', 'Percentage calculations', '%', 'percentages', 5),
  ('algebra', 'Algebra Island', 'Basic algebraic expressions', 'x', 'algebra', 6)
ON CONFLICT (id) DO NOTHING;

-- Seed BODMAS Island levels (7 regular + 2 boss)
INSERT INTO public.levels (id, lesson_id, name, description, level_type, order_index, question_count, unlock_requirements) VALUES
  ('bodmas_level_1', 'bodmas', 'Level 1: Simple Addition', 'Start with basic addition problems', 'regular', 1, 10, '{}'),
  ('bodmas_level_2', 'bodmas', 'Level 2: Addition & Subtraction', 'Combine addition and subtraction', 'regular', 2, 10, '{"required_levels": ["bodmas_level_1"]}'),
  ('bodmas_level_3', 'bodmas', 'Level 3: Multiplication Basics', 'Learn multiplication operations', 'regular', 3, 10, '{"required_levels": ["bodmas_level_2"]}'),
  ('bodmas_level_4', 'bodmas', 'Level 4: Division Basics', 'Master division operations', 'regular', 4, 10, '{"required_levels": ["bodmas_level_3"]}'),
  ('bodmas_level_5', 'bodmas', 'Level 5: Mixed Operations', 'Combine all four operations', 'regular', 5, 10, '{"required_levels": ["bodmas_level_4"]}'),
  ('bodmas_level_6', 'bodmas', 'Level 6: Parentheses', 'Work with parentheses in expressions', 'regular', 6, 10, '{"required_levels": ["bodmas_level_5"]}'),
  ('bodmas_level_7', 'bodmas', 'Level 7: Complex BODMAS', 'Master complex order of operations', 'regular', 7, 10, '{"required_levels": ["bodmas_level_6"]}'),
  ('bodmas_boss_1', 'bodmas', 'Boss 1: BODMAS Master', 'Ultimate challenge of order of operations', 'boss_1', 8, 25, '{"required_levels": ["bodmas_level_7"]}'),
  ('bodmas_boss_2', 'bodmas', 'Boss 2: BODMAS Champion', 'Final boss battle for BODMAS mastery', 'boss_2', 9, 25, '{"required_levels": ["bodmas_boss_1"]}')
ON CONFLICT (id) DO NOTHING;

-- Seed Grid Method Island levels (3 regular + 2 boss)
INSERT INTO public.levels (id, lesson_id, name, description, level_type, order_index, question_count, unlock_requirements) VALUES
  ('grid_method_level_1', 'grid_method', 'Level 1: Single Digit Grid', 'Learn grid method with single digits', 'regular', 1, 10, '{"required_levels": ["bodmas_boss_2"]}'),
  ('grid_method_level_2', 'grid_method', 'Level 2: Two Digit Grid', 'Master two-digit multiplication', 'regular', 2, 10, '{"required_levels": ["grid_method_level_1"]}'),
  ('grid_method_level_3', 'grid_method', 'Level 3: Advanced Grid', 'Complex grid method problems', 'regular', 3, 10, '{"required_levels": ["grid_method_level_2"]}'),
  ('grid_method_boss_1', 'grid_method', 'Boss 1: Grid Master', 'Ultimate grid method challenge', 'boss_1', 4, 25, '{"required_levels": ["grid_method_level_3"]}'),
  ('grid_method_boss_2', 'grid_method', 'Boss 2: Grid Champion', 'Final grid method boss battle', 'boss_2', 5, 25, '{"required_levels": ["grid_method_boss_1"]}')
ON CONFLICT (id) DO NOTHING;

-- Seed Fractions Island levels (8 regular + 2 boss)
INSERT INTO public.levels (id, lesson_id, name, description, level_type, order_index, question_count, unlock_requirements) VALUES
  ('fractions_level_1', 'fractions', 'Level 1: Fraction Basics', 'Introduction to fractions', 'regular', 1, 10, '{"required_levels": ["grid_method_boss_2"]}'),
  ('fractions_level_2', 'fractions', 'Level 2: Adding Fractions', 'Learn to add fractions', 'regular', 2, 10, '{"required_levels": ["fractions_level_1"]}'),
  ('fractions_level_3', 'fractions', 'Level 3: Subtracting Fractions', 'Master fraction subtraction', 'regular', 3, 10, '{"required_levels": ["fractions_level_2"]}'),
  ('fractions_level_4', 'fractions', 'Level 4: Multiplying Fractions', 'Learn fraction multiplication', 'regular', 4, 10, '{"required_levels": ["fractions_level_3"]}'),
  ('fractions_level_5', 'fractions', 'Level 5: Dividing Fractions', 'Master fraction division', 'regular', 5, 10, '{"required_levels": ["fractions_level_4"]}'),
  ('fractions_level_6', 'fractions', 'Level 6: Mixed Numbers', 'Work with mixed numbers', 'regular', 6, 10, '{"required_levels": ["fractions_level_5"]}'),
  ('fractions_level_7', 'fractions', 'Level 7: Complex Fractions', 'Complex fraction operations', 'regular', 7, 10, '{"required_levels": ["fractions_level_6"]}'),
  ('fractions_level_8', 'fractions', 'Level 8: Advanced Fractions', 'Advanced fraction problems', 'regular', 8, 10, '{"required_levels": ["fractions_level_7"]}'),
  ('fractions_boss_1', 'fractions', 'Boss 1: Fraction Master', 'Ultimate fraction challenge', 'boss_1', 9, 25, '{"required_levels": ["fractions_level_8"]}'),
  ('fractions_boss_2', 'fractions', 'Boss 2: Fraction Champion', 'Final fraction boss battle', 'boss_2', 10, 25, '{"required_levels": ["fractions_boss_1"]}')
ON CONFLICT (id) DO NOTHING;

-- Seed Decimals Island levels (6 regular + 2 boss)
INSERT INTO public.levels (id, lesson_id, name, description, level_type, order_index, question_count, unlock_requirements) VALUES
  ('decimals_level_1', 'decimals', 'Level 1: Decimal Basics', 'Introduction to decimals', 'regular', 1, 10, '{"required_levels": ["fractions_boss_2"]}'),
  ('decimals_level_2', 'decimals', 'Level 2: Adding Decimals', 'Learn to add decimals', 'regular', 2, 10, '{"required_levels": ["decimals_level_1"]}'),
  ('decimals_level_3', 'decimals', 'Level 3: Subtracting Decimals', 'Master decimal subtraction', 'regular', 3, 10, '{"required_levels": ["decimals_level_2"]}'),
  ('decimals_level_4', 'decimals', 'Level 4: Multiplying Decimals', 'Learn decimal multiplication', 'regular', 4, 10, '{"required_levels": ["decimals_level_3"]}'),
  ('decimals_level_5', 'decimals', 'Level 5: Dividing Decimals', 'Master decimal division', 'regular', 5, 10, '{"required_levels": ["decimals_level_4"]}'),
  ('decimals_level_6', 'decimals', 'Level 6: Mixed Decimal Operations', 'Complex decimal problems', 'regular', 6, 10, '{"required_levels": ["decimals_level_5"]}'),
  ('decimals_boss_1', 'decimals', 'Boss 1: Decimal Master', 'Ultimate decimal challenge', 'boss_1', 7, 25, '{"required_levels": ["decimals_level_6"]}'),
  ('decimals_boss_2', 'decimals', 'Boss 2: Decimal Champion', 'Final decimal boss battle', 'boss_2', 8, 25, '{"required_levels": ["decimals_boss_1"]}')
ON CONFLICT (id) DO NOTHING;

-- Seed Percentages Island levels (6 regular + 2 boss)
INSERT INTO public.levels (id, lesson_id, name, description, level_type, order_index, question_count, unlock_requirements) VALUES
  ('percentages_level_1', 'percentages', 'Level 1: Percentage Basics', 'Introduction to percentages', 'regular', 1, 10, '{"required_levels": ["decimals_boss_2"]}'),
  ('percentages_level_2', 'percentages', 'Level 2: Converting Percentages', 'Convert between percentages and decimals', 'regular', 2, 10, '{"required_levels": ["percentages_level_1"]}'),
  ('percentages_level_3', 'percentages', 'Level 3: Percentage of a Number', 'Find percentage of a number', 'regular', 3, 10, '{"required_levels": ["percentages_level_2"]}'),
  ('percentages_level_4', 'percentages', 'Level 4: Percentage Increase', 'Calculate percentage increases', 'regular', 4, 10, '{"required_levels": ["percentages_level_3"]}'),
  ('percentages_level_5', 'percentages', 'Level 5: Percentage Decrease', 'Calculate percentage decreases', 'regular', 5, 10, '{"required_levels": ["percentages_level_4"]}'),
  ('percentages_level_6', 'percentages', 'Level 6: Complex Percentages', 'Complex percentage problems', 'regular', 6, 10, '{"required_levels": ["percentages_level_5"]}'),
  ('percentages_boss_1', 'percentages', 'Boss 1: Percentage Master', 'Ultimate percentage challenge', 'boss_1', 7, 25, '{"required_levels": ["percentages_level_6"]}'),
  ('percentages_boss_2', 'percentages', 'Boss 2: Percentage Champion', 'Final percentage boss battle', 'boss_2', 8, 25, '{"required_levels": ["percentages_boss_1"]}')
ON CONFLICT (id) DO NOTHING;

-- Seed Algebra Island levels (6 regular + 2 boss)
INSERT INTO public.levels (id, lesson_id, name, description, level_type, order_index, question_count, unlock_requirements) VALUES
  ('algebra_level_1', 'algebra', 'Level 1: Variable Basics', 'Introduction to variables', 'regular', 1, 10, '{"required_levels": ["percentages_boss_2"]}'),
  ('algebra_level_2', 'algebra', 'Level 2: Simple Expressions', 'Evaluate simple expressions', 'regular', 2, 10, '{"required_levels": ["algebra_level_1"]}'),
  ('algebra_level_3', 'algebra', 'Level 3: Substitution', 'Substitute values into expressions', 'regular', 3, 10, '{"required_levels": ["algebra_level_2"]}'),
  ('algebra_level_4', 'algebra', 'Level 4: Combining Like Terms', 'Simplify expressions', 'regular', 4, 10, '{"required_levels": ["algebra_level_3"]}'),
  ('algebra_level_5', 'algebra', 'Level 5: Expanding Expressions', 'Expand algebraic expressions', 'regular', 5, 10, '{"required_levels": ["algebra_level_4"]}'),
  ('algebra_level_6', 'algebra', 'Level 6: Advanced Algebra', 'Complex algebraic expressions', 'regular', 6, 10, '{"required_levels": ["algebra_level_5"]}'),
  ('algebra_boss_1', 'algebra', 'Boss 1: Algebra Master', 'Ultimate algebra challenge', 'boss_1', 7, 25, '{"required_levels": ["algebra_level_6"]}'),
  ('algebra_boss_2', 'algebra', 'Boss 2: Algebra Champion', 'Final algebra boss battle', 'boss_2', 8, 25, '{"required_levels": ["algebra_boss_1"]}')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- MIGRATION 003: RLS Policies
-- ============================================

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_questions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Lessons policies
-- Everyone can read lessons (public metadata)
CREATE POLICY "Lessons are publicly readable" ON public.lessons
  FOR SELECT USING (true);

-- Levels policies
-- Everyone can read levels (public metadata)
CREATE POLICY "Levels are publicly readable" ON public.levels
  FOR SELECT USING (true);

-- User progress policies
-- Users can only read their own progress
CREATE POLICY "Users can read own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert own progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update own progress" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- User unlocks policies
-- Users can only read their own unlocks
CREATE POLICY "Users can read own unlocks" ON public.user_unlocks
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own unlocks
CREATE POLICY "Users can insert own unlocks" ON public.user_unlocks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Question sessions policies
-- Users can only read their own sessions
CREATE POLICY "Users can read own sessions" ON public.question_sessions
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own sessions
CREATE POLICY "Users can insert own sessions" ON public.question_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own sessions
CREATE POLICY "Users can update own sessions" ON public.question_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Session questions policies
-- Users can only read questions from their own sessions
CREATE POLICY "Users can read own session questions" ON public.session_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.question_sessions
      WHERE question_sessions.id = session_questions.session_id
      AND question_sessions.user_id = auth.uid()
    )
  );

-- Users can insert questions into their own sessions
CREATE POLICY "Users can insert own session questions" ON public.session_questions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.question_sessions
      WHERE question_sessions.id = session_questions.session_id
      AND question_sessions.user_id = auth.uid()
    )
  );

-- Users can update questions in their own sessions
CREATE POLICY "Users can update own session questions" ON public.session_questions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.question_sessions
      WHERE question_sessions.id = session_questions.session_id
      AND question_sessions.user_id = auth.uid()
    )
  );

