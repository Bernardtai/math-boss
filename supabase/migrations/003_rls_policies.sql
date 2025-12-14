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

