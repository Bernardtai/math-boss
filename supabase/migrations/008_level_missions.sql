-- Migration 008: Add Mission and Story Fields to Levels
-- Adds mission_type, story_intro, story_failure_variants, and boss_environment fields

-- Add mission_type column
ALTER TABLE public.levels
ADD COLUMN IF NOT EXISTS mission_type TEXT CHECK (mission_type IN ('escape', 'hit', 'collect', 'race', 'puzzle', 'defend'));

-- Add story_intro JSONB column with age-based story text
ALTER TABLE public.levels
ADD COLUMN IF NOT EXISTS story_intro JSONB DEFAULT '{}'::jsonb;

-- Add story_failure_variants JSONB column (array of alternative storylines)
ALTER TABLE public.levels
ADD COLUMN IF NOT EXISTS story_failure_variants JSONB DEFAULT '[]'::jsonb;

-- Add boss_environment JSONB column for boss level visual/atmosphere settings
ALTER TABLE public.levels
ADD COLUMN IF NOT EXISTS boss_environment JSONB DEFAULT '{}'::jsonb;

-- Add comments explaining the structure
COMMENT ON COLUMN public.levels.mission_type IS 'Type of mission: escape, hit, collect, race, puzzle, or defend';
COMMENT ON COLUMN public.levels.story_intro IS 'Age-based story introduction: {age_5_7: string, age_8_10: string, age_11_15: string}';
COMMENT ON COLUMN public.levels.story_failure_variants IS 'Array of alternative storylines for failures: [{age_5_7: string, age_8_10: string, age_11_15: string, failure_type: string}]';
COMMENT ON COLUMN public.levels.boss_environment IS 'Boss level environment settings: {theme: string, intensity: number, visual_effects: object}';

-- Create index on mission_type for faster filtering
CREATE INDEX IF NOT EXISTS idx_levels_mission_type ON public.levels(mission_type);

