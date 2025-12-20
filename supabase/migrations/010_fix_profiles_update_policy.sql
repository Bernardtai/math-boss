-- Migration 010: Fix Profiles UPDATE RLS Policy
-- Adds WITH CHECK clause to UPDATE policy to allow age and avatar_customization updates

-- Drop existing update policy
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Recreate with WITH CHECK clause
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

