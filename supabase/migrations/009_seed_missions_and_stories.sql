-- Migration 009: Seed Mission Types, Story Intros, Failure Variants, and Boss Environments
-- Adds mission-based gameplay and story content to all existing levels

-- Helper function to generate story intros and failure variants
-- This updates all levels with mission types and story content

-- BODMAS Island Levels
UPDATE public.levels SET
  mission_type = 'escape',
  story_intro = '{
    "age_5_7": "A friendly monster wants to play! Answer questions to run away safely.",
    "age_8_10": "A monster is chasing you! Solve math problems quickly to escape.",
    "age_11_15": "A terrifying creature pursues you through the forest. Your only hope is to solve these math problems correctly and escape before it catches you!"
  }'::jsonb,
  story_failure_variants = '[
    {
      "age_5_7": "The monster tripped! You can try again!",
      "age_8_10": "The monster stumbled over a rock, giving you another chance to escape!",
      "age_11_15": "As the creature lunged forward, it tripped on a hidden root. You have a brief moment to regroup and try again!"
    },
    {
      "age_5_7": "The monster got tired! Try once more!",
      "age_8_10": "The monster paused to catch its breath. This is your opportunity!",
      "age_11_15": "The creature slowed down, its energy waning. You notice an opening - this could be your chance to escape!"
    }
  ]'::jsonb
WHERE id = 'bodmas_level_1';

UPDATE public.levels SET
  mission_type = 'hit',
  story_intro = '{
    "age_5_7": "Hit the monster with correct answers!",
    "age_8_10": "Defeat the monster by hitting it with correct math answers!",
    "age_11_15": "The creature blocks your path. Strike it down with precise mathematical calculations!"
  }'::jsonb,
  story_failure_variants = '[
    {
      "age_5_7": "The monster dodged! Try hitting it again!",
      "age_8_10": "The monster blocked your attack! Aim better next time!",
      "age_11_15": "Your attack was deflected. The creature is learning your patterns - adapt your strategy!"
    }
  ]'::jsonb
WHERE id = 'bodmas_level_2';

UPDATE public.levels SET
  mission_type = 'collect',
  story_intro = '{
    "age_5_7": "Collect treasures by solving math problems!",
    "age_8_10": "Gather magical treasures hidden around the island by solving problems!",
    "age_11_15": "Ancient treasures are scattered throughout this area. Solve these mathematical puzzles to claim them before they disappear!"
  }'::jsonb,
  story_failure_variants = '[
    {
      "age_5_7": "The treasure moved! Find it again!",
      "age_8_10": "The treasure slipped away! Keep searching!",
      "age_11_15": "The treasure vanished into thin air. You must be more precise in your calculations to secure it!"
    }
  ]'::jsonb
WHERE id = 'bodmas_level_3';

UPDATE public.levels SET
  mission_type = 'race',
  story_intro = '{
    "age_5_7": "Race to finish! Answer questions quickly!",
    "age_8_10": "Race against time to solve all problems before time runs out!",
    "age_11_15": "Time is running out! The island is sinking, and you must solve these problems quickly to reach safety!"
  }'::jsonb,
  story_failure_variants = '[
    {
      "age_5_7": "Time ran out! Try racing faster!",
      "age_8_10": "You ran out of time! Speed up your calculations!",
      "age_11_15": "Time expired. The ground beneath you shifts - you need to be faster and more accurate!"
    }
  ]'::jsonb
WHERE id = 'bodmas_level_4';

UPDATE public.levels SET
  mission_type = 'puzzle',
  story_intro = '{
    "age_5_7": "Solve puzzles with math!",
    "age_8_10": "Unlock puzzles by solving mathematical problems!",
    "age_11_15": "Ancient puzzles guard the path forward. Decipher them using your mathematical knowledge!"
  }'::jsonb,
  story_failure_variants = '[
    {
      "age_5_7": "The puzzle reset! Try solving it again!",
      "age_8_10": "The puzzle changed! Think carefully!",
      "age_11_15": "The puzzle reshuffled itself. You must approach it from a different angle!"
    }
  ]'::jsonb
WHERE id = 'bodmas_level_5';

UPDATE public.levels SET
  mission_type = 'defend',
  story_intro = '{
    "age_5_7": "Defend your spot! Answer correctly!",
    "age_8_10": "Defend your position by solving problems correctly!",
    "age_11_15": "Enemies approach from all sides. Hold your ground by solving these problems accurately!"
  }'::jsonb,
  story_failure_variants = '[
    {
      "age_5_7": "You got pushed back! Stand strong!",
      "age_8_10": "Your defense weakened! Strengthen it with correct answers!",
      "age_11_15": "Your defenses crumbled. Regroup and fortify your position with precise calculations!"
    }
  ]'::jsonb
WHERE id = 'bodmas_level_6';

UPDATE public.levels SET
  mission_type = 'escape',
  story_intro = '{
    "age_5_7": "Escape the big monster! Use all your math skills!",
    "age_8_10": "A giant monster blocks your way! Escape using complex math!",
    "age_11_15": "A colossal beast stands between you and freedom. Master these complex calculations to escape its grasp!"
  }'::jsonb,
  story_failure_variants = '[
    {
      "age_5_7": "The monster got distracted! Try again!",
      "age_8_10": "The monster looked away! Use this chance!",
      "age_11_15": "The beast momentarily turned its attention elsewhere. This brief window might be your only opportunity!"
    }
  ]'::jsonb
WHERE id = 'bodmas_level_7';

-- Boss Levels with darker environments
UPDATE public.levels SET
  mission_type = 'hit',
  story_intro = '{
    "age_5_7": "Fight the boss monster! You can do it!",
    "age_8_10": "Face the BODMAS Boss! Defeat it with your math skills!",
    "age_11_15": "The BODMAS Master emerges from the shadows. This ancient guardian tests your mastery of order of operations. One wrong move, and you will be consumed by mathematical chaos!"
  }'::jsonb,
  story_failure_variants = '[
    {
      "age_5_7": "The boss got stronger! Try harder!",
      "age_8_10": "The boss powered up! Use better strategies!",
      "age_11_15": "The Master\'s power intensifies. Your mistakes have awakened its true form. You must be flawless to survive!"
    }
  ]'::jsonb,
  boss_environment = '{
    "theme": "dark_forest",
    "intensity": 0.7,
    "visual_effects": {
      "colorScheme": ["#1a1a1a", "#2d2d2d", "#4a4a4a", "#8b0000"],
      "lighting": "dark",
      "atmosphere": "ominous"
    }
  }'::jsonb
WHERE id = 'bodmas_boss_1';

UPDATE public.levels SET
  mission_type = 'defend',
  story_intro = '{
    "age_5_7": "The final boss! Defend yourself!",
    "age_8_10": "The BODMAS Champion attacks! Defend with perfect math!",
    "age_11_15": "The ultimate BODMAS Champion rises. This is the final test. Your mathematical precision must be absolute, or you will fall into the abyss of incorrect calculations!"
  }'::jsonb,
  story_failure_variants = '[
    {
      "age_5_7": "The boss is very strong! Keep trying!",
      "age_8_10": "The Champion is powerful! Don\'t give up!",
      "age_11_15": "The Champion\'s attacks grow more devastating. Each error weakens your defenses. You must achieve perfection!"
    }
  ]'::jsonb,
  boss_environment = '{
    "theme": "shadow_realm",
    "intensity": 0.9,
    "visual_effects": {
      "colorScheme": ["#000000", "#1a1a2e", "#16213e", "#0f3460"],
      "lighting": "dark",
      "atmosphere": "mysterious"
    }
  }'::jsonb
WHERE id = 'bodmas_boss_2';

-- Grid Method Island (sample - apply similar pattern to all)
UPDATE public.levels SET
  mission_type = 'collect',
  story_intro = '{
    "age_5_7": "Collect grid pieces!",
    "age_8_10": "Collect grid pieces by solving multiplication problems!",
    "age_11_15": "Magical grid fragments are scattered across this realm. Master the grid method to collect them all!"
  }'::jsonb,
  story_failure_variants = '[
    {
      "age_5_7": "The pieces moved! Find them again!",
      "age_8_10": "The pieces scattered! Regather them!",
      "age_11_15": "The fragments shifted positions. Your calculations must be more precise to secure them!"
    }
  ]'::jsonb
WHERE id LIKE 'grid_method_level%';

UPDATE public.levels SET
  mission_type = 'hit',
  boss_environment = '{
    "theme": "haunted_castle",
    "intensity": 0.6,
    "visual_effects": {
      "colorScheme": ["#2d1810", "#4a2c1a", "#6b4423", "#8b0000"],
      "lighting": "dim",
      "atmosphere": "eerie"
    }
  }'::jsonb
WHERE id LIKE 'grid_method_boss%';

-- Fractions Island
UPDATE public.levels SET
  mission_type = 'puzzle',
  story_intro = '{
    "age_5_7": "Solve fraction puzzles!",
    "age_8_10": "Unlock fraction puzzles by solving problems!",
    "age_11_15": "Ancient fraction puzzles guard the path. Decipher them to progress!"
  }'::jsonb,
  story_failure_variants = '[
    {
      "age_5_7": "The puzzle changed! Try again!",
      "age_8_10": "The puzzle reset! Solve it differently!",
      "age_11_15": "The puzzle transformed. You must adapt your approach to these fraction mysteries!"
    }
  ]'::jsonb
WHERE id LIKE 'fractions_level%';

UPDATE public.levels SET
  mission_type = 'defend',
  boss_environment = '{
    "theme": "volcanic_cavern",
    "intensity": 0.7,
    "visual_effects": {
      "colorScheme": ["#1a0000", "#4a0000", "#8b0000", "#ff4500"],
      "lighting": "dim",
      "atmosphere": "intense"
    }
  }'::jsonb
WHERE id LIKE 'fractions_boss%';

-- Decimals Island
UPDATE public.levels SET
  mission_type = 'race',
  story_intro = '{
    "age_5_7": "Race with decimals!",
    "age_8_10": "Race against time with decimal problems!",
    "age_11_15": "Time is critical! Master decimal operations quickly to survive!"
  }'::jsonb,
  story_failure_variants = '[
    {
      "age_5_7": "Time ran out! Go faster!",
      "age_8_10": "You need more speed!",
      "age_11_15": "Time expired. The decimal realm demands both speed and accuracy!"
    }
  ]'::jsonb
WHERE id LIKE 'decimals_level%';

UPDATE public.levels SET
  mission_type = 'escape',
  boss_environment = '{
    "theme": "dark_forest",
    "intensity": 0.8,
    "visual_effects": {
      "colorScheme": ["#1a1a1a", "#2d2d2d", "#4a4a4a", "#8b0000"],
      "lighting": "dark",
      "atmosphere": "ominous"
    }
  }'::jsonb
WHERE id LIKE 'decimals_boss%';

-- Percentages Island
UPDATE public.levels SET
  mission_type = 'collect',
  story_intro = '{
    "age_5_7": "Collect percentage treasures!",
    "age_8_10": "Gather percentage treasures!",
    "age_11_15": "Percentage crystals are hidden throughout. Calculate precisely to claim them!"
  }'::jsonb,
  story_failure_variants = '[
    {
      "age_5_7": "The treasures moved!",
      "age_8_10": "The crystals shifted!",
      "age_11_15": "The crystals vanished. Your percentage calculations must be flawless!"
    }
  ]'::jsonb
WHERE id LIKE 'percentages_level%';

UPDATE public.levels SET
  mission_type = 'hit',
  boss_environment = '{
    "theme": "shadow_realm",
    "intensity": 0.75,
    "visual_effects": {
      "colorScheme": ["#000000", "#1a1a2e", "#16213e", "#0f3460"],
      "lighting": "dark",
      "atmosphere": "mysterious"
    }
  }'::jsonb
WHERE id LIKE 'percentages_boss%';

-- Algebra Island
UPDATE public.levels SET
  mission_type = 'puzzle',
  story_intro = '{
    "age_5_7": "Solve algebra puzzles!",
    "age_8_10": "Unlock algebra mysteries!",
    "age_11_15": "Algebraic enigmas block your path. Solve them to unlock the secrets!"
  }'::jsonb,
  story_failure_variants = '[
    {
      "age_5_7": "The puzzle changed!",
      "age_8_10": "The mystery deepened!",
      "age_11_15": "The algebraic puzzle evolved. You must think differently to solve it!"
    }
  ]'::jsonb
WHERE id LIKE 'algebra_level%';

UPDATE public.levels SET
  mission_type = 'defend',
  boss_environment = '{
    "theme": "haunted_castle",
    "intensity": 0.85,
    "visual_effects": {
      "colorScheme": ["#2d1810", "#4a2c1a", "#6b4423", "#8b0000"],
      "lighting": "dim",
      "atmosphere": "eerie"
    }
  }'::jsonb
WHERE id LIKE 'algebra_boss%';

