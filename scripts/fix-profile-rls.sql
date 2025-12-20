-- Fix Profile RLS Policies
-- Run this in your Supabase SQL Editor to add the missing INSERT policy

-- Add INSERT policy for profiles table
-- This allows users to create their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Verify the policy was created
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'profiles';

