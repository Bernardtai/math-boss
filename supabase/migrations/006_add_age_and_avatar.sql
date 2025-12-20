-- Migration 006: Add Age and Avatar Customization to Profiles
-- Adds age field and avatar_customization JSONB field to profiles table

-- Add age column (5-15)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS age INTEGER CHECK (age >= 5 AND age <= 15);

-- Add avatar_customization JSONB column
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_customization JSONB DEFAULT '{}'::jsonb;

-- Add comment explaining the avatar_customization structure
COMMENT ON COLUMN public.profiles.avatar_customization IS 'Stores avatar customization data: {skinColor, hairStyle, hairColor, clothing, accessories[], faceFeatures{}, bodyType}';

-- Create index on age for faster age-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_age ON public.profiles(age);

-- Update existing profiles with default avatar customization if null
UPDATE public.profiles
SET avatar_customization = '{
  "skinColor": "default",
  "hairStyle": "default",
  "hairColor": "default",
  "clothing": "default",
  "accessories": [],
  "faceFeatures": {},
  "bodyType": "default"
}'::jsonb
WHERE avatar_customization IS NULL OR avatar_customization = '{}'::jsonb;

