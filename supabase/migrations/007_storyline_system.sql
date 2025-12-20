-- Migration 007: Create Storyline State Tracking System
-- Creates user_story_state table to track storyline progress and failure variants

-- Create user_story_state table
CREATE TABLE IF NOT EXISTS public.user_story_state (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  level_id TEXT REFERENCES public.levels(id) ON DELETE CASCADE NOT NULL,
  attempt_count INTEGER DEFAULT 1,
  last_failure_type TEXT, -- 'timeout', 'wrong_answers', 'too_slow', etc.
  story_context JSONB DEFAULT '{}'::jsonb, -- Current story state and progression
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, level_id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_user_story_state_user_id ON public.user_story_state(user_id);
CREATE INDEX IF NOT EXISTS idx_user_story_state_level_id ON public.user_story_state(level_id);
CREATE INDEX IF NOT EXISTS idx_user_story_state_user_level ON public.user_story_state(user_id, level_id);

-- Add comment explaining the table
COMMENT ON TABLE public.user_story_state IS 'Tracks storyline progression, attempt counts, and failure types for dynamic story adaptation';

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_story_state_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS set_story_state_updated_at ON public.user_story_state;
CREATE TRIGGER set_story_state_updated_at
  BEFORE UPDATE ON public.user_story_state
  FOR EACH ROW
  EXECUTE FUNCTION public.update_story_state_updated_at();

-- Enable RLS
ALTER TABLE public.user_story_state ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own story state
CREATE POLICY "Users can read own story state" ON public.user_story_state
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own story state" ON public.user_story_state
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own story state" ON public.user_story_state
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own story state" ON public.user_story_state
  FOR DELETE USING (auth.uid() = user_id);

