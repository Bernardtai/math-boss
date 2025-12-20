# PRP: Island-Based Lesson System with Progression

## Feature: Gamified Math Learning with Island Progression

Implement an engaging island-based lesson system where students progress through math topics (BODMAS, Grid Method, Fractions, Decimals, Percentages, Algebra) with unlockable levels, boss challenges, and visual progress tracking.

## Research Context

### Learning Psychology Principles
- **Progressive Disclosure**: Unlock content based on mastery
- **Gamification**: Islands, levels, and boss challenges
- **Immediate Feedback**: Real-time scoring and time penalties
- **Visual Progress**: Clear indication of completed vs. locked content

### Math Topics Structure (from idea.txt)
1. **BODMAS** - Order of operations (7 levels + 2 bosses)
2. **Grid Method** - Fast multiplication (3 levels + 1 boss)
3. **Fraction Calculations** - Mixed operations (8 levels + 1 boss)
4. **Decimal Operations** - All four operations (6 levels + 1 boss)
5. **Percentage Basics** - Percentage calculations (6 levels + 1 boss)
6. **Algebra** - Basic expressions (6 levels + 1 boss)

## Implementation Blueprint

### Database Schema
```sql
-- Lessons and levels structure
CREATE TABLE public.lessons (
  id TEXT PRIMARY KEY, -- 'bodmas', 'grid_method', etc.
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  color_theme TEXT, -- for island theming
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.levels (
  id TEXT PRIMARY KEY, -- 'bodmas_level_1', 'bodmas_boss_1', etc.
  lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  level_type TEXT NOT NULL, -- 'regular', 'boss_1', 'boss_2'
  order_index INTEGER NOT NULL,
  unlock_requirements JSONB, -- {"min_score": 80, "required_levels": ["bodmas_level_1"]}
  question_count INTEGER DEFAULT 20,
  time_limit INTEGER, -- in seconds, null for no limit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress tracking
CREATE TABLE public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  level_id TEXT REFERENCES public.levels(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  time_taken INTEGER, -- in seconds
  questions_answered INTEGER DEFAULT 0,
  questions_correct INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_boss_level BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, level_id)
);

-- User unlock status
CREATE TABLE public.user_unlocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  level_id TEXT REFERENCES public.levels(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, level_id)
);
```

### Component Architecture
```
app/
├── lessons/
│   ├── page.tsx                    # Main lessons overview
│   ├── [lessonId]/
│   │   ├── page.tsx               # Lesson detail view
│   │   └── [levelId]/
│   │       ├── page.tsx           # Level play interface
│   │       └── complete/
│   │           └── page.tsx       # Level completion screen
│   └── play/
│       └── [levelId]/
│           └── page.tsx           # Game interface

components/
├── lessons/
│   ├── LessonIsland.tsx           # Individual island component
│   ├── LessonGrid.tsx             # Grid of all lessons
│   ├── LevelCard.tsx              # Individual level card
│   ├── ProgressIndicator.tsx      # Visual progress bar
│   └── UnlockAnimation.tsx        # Level unlock animation
├── game/
│   ├── GameInterface.tsx          # Main game UI
│   ├── QuestionDisplay.tsx        # Question presentation
│   ├── AnswerInput.tsx            # Answer input methods
│   ├── Timer.tsx                  # Countdown timer
│   └── ScoreDisplay.tsx           # Real-time score
└── progress/
    ├── ProgressChart.tsx          # Visual progress tracking
    └── AchievementBadge.tsx       # Completion badges
```

### Game Logic Implementation
```typescript
// Game state management
interface GameState {
  currentLevel: Level;
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  timeRemaining: number;
  timePenalty: number; // +5 seconds for wrong answers
  isCompleted: boolean;
}

// Question generation system
interface Question {
  id: string;
  question: string;
  correctAnswer: number | string;
  options?: (number | string)[]; // for multiple choice
  type: 'input' | 'multiple_choice';
  difficulty: number;
}
```

## Implementation Tasks

1. **Database Setup**
   - Create lessons and levels tables
   - Seed initial data for all 6 math topics
   - Set up RLS policies for user data

2. **Lesson Data Structure**
   - Define lesson metadata (names, descriptions, themes)
   - Create level progression rules
   - Implement unlock requirements logic

3. **UI Components**
   - Build responsive island-based lesson grid
   - Create level cards with lock/unlock states
   - Implement progress visualization

4. **Game Interface**
   - Design mobile-first game UI
   - Implement question display system
   - Add timer and scoring mechanics

5. **Progress Tracking**
   - Track user completion status
   - Calculate unlock conditions
   - Store performance metrics

6. **Boss Level Logic**
   - Implement boss level requirements
   - Create mixed question generation
   - Add special boss level UI

## Validation Gates

### Functional Tests
```bash
# Test lesson progression
npm run test:lessons

# Test unlock logic
npm run test:unlocks

# Test game mechanics
npm run test:game
```

### Database Tests
```sql
-- Verify lesson structure
SELECT l.name, COUNT(lev.id) as level_count 
FROM lessons l 
LEFT JOIN levels lev ON l.id = lev.lesson_id 
GROUP BY l.id, l.name;

-- Check user progress
SELECT COUNT(*) FROM user_progress WHERE completed_at IS NOT NULL;
```

### Manual Testing Checklist
- [ ] All 6 lessons display correctly
- [ ] Level progression works as expected
- [ ] Unlock requirements function properly
- [ ] Boss levels have correct requirements
- [ ] Mobile interface is responsive
- [ ] Progress tracking is accurate

## Game Mechanics Implementation

### Scoring System
- **Base Score**: 100 points per correct answer
- **Time Bonus**: Faster completion = higher score
- **Accuracy Penalty**: Wrong answers add +5 seconds
- **Boss Multiplier**: Boss levels have 2x score multiplier

### Unlock Logic
```typescript
function canUnlockLevel(userId: string, levelId: string): boolean {
  const level = getLevel(levelId);
  const userProgress = getUserProgress(userId);
  
  // Check required levels completed
  for (const requiredLevel of level.unlock_requirements.required_levels) {
    if (!userProgress.completed_levels.includes(requiredLevel)) {
      return false;
    }
  }
  
  // Check minimum score requirements
  const requiredScore = level.unlock_requirements.min_score;
  const userScore = calculateUserScore(userId, level.lesson_id);
  
  return userScore >= requiredScore;
}
```

### Question Generation
- **BODMAS**: Order of operations problems
- **Grid Method**: Multiplication using grid method
- **Fractions**: Addition, subtraction, multiplication, division
- **Decimals**: All four operations with decimal numbers
- **Percentages**: Percentage calculations and conversions
- **Algebra**: Basic algebraic expressions with substitution

## Error Handling Strategy

### Game Errors
- **Network Issues**: Auto-save progress, resume on reconnect
- **Invalid Answers**: Clear validation messages
- **Timer Issues**: Graceful handling of time expiration

### Progress Errors
- **Save Failures**: Retry mechanism with user notification
- **Unlock Issues**: Manual unlock option for admins
- **Data Corruption**: Backup and restore mechanisms

## Performance Requirements

- **Lesson Load**: < 2 seconds for lesson overview
- **Game Start**: < 1 second to begin playing
- **Question Display**: < 500ms for new questions
- **Progress Save**: < 1 second for completion data
- **Mobile Performance**: Smooth 60fps animations

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and descriptions
- **High Contrast**: Alternative color schemes
- **Font Size**: Adjustable text sizing
- **Audio Cues**: Optional sound effects

## Success Criteria

- [ ] All 6 math topics implemented with correct progression
- [ ] Island-based UI is engaging and intuitive
- [ ] Level unlock system works correctly
- [ ] Boss levels provide appropriate challenge
- [ ] Progress tracking is accurate and persistent
- [ ] Mobile experience is smooth and responsive
- [ ] Game mechanics are balanced and fun

## Confidence Score: 8/10

This PRP provides comprehensive guidance for implementing a gamified lesson system with proper progression mechanics, following educational game design principles and mobile-first development practices.
