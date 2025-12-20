# PRP: Math Question Generation and Validation Engine

## Feature: Dynamic Math Question Generation System

Implement a comprehensive math question generation engine that creates appropriate problems for each lesson type (BODMAS, Grid Method, Fractions, Decimals, Percentages, Algebra) with varying difficulty levels, answer validation, and performance tracking.

## Research Context

### Math Education Principles
- **Scaffolded Learning**: Progressive difficulty within each topic
- **Immediate Feedback**: Real-time answer validation
- **Adaptive Difficulty**: Questions adjust based on performance
- **Multiple Formats**: Input fields, multiple choice, visual representations

### Question Types by Lesson (from idea.txt)
1. **BODMAS**: Order of operations (1-3 digit numbers)
2. **Grid Method**: Multiplication problems (1-2 digit numbers)
3. **Fractions**: Mixed operations with proper/improper fractions
4. **Decimals**: All four operations with decimal precision
5. **Percentages**: Percentage calculations and conversions
6. **Algebra**: Variable substitution and evaluation

## Implementation Blueprint

### Database Schema
```sql
-- Question templates and generation rules
CREATE TABLE public.question_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  level_id TEXT REFERENCES public.levels(id) ON DELETE CASCADE,
  template_type TEXT NOT NULL, -- 'bodmas', 'fraction_addition', etc.
  difficulty_level INTEGER NOT NULL, -- 1-5 scale
  question_template TEXT NOT NULL, -- Template with placeholders
  answer_template TEXT NOT NULL, -- Answer calculation template
  parameters JSONB NOT NULL, -- Generation parameters
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated questions for sessions
CREATE TABLE public.question_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  level_id TEXT REFERENCES public.levels(id) ON DELETE CASCADE,
  session_started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_completed_at TIMESTAMP WITH TIME ZONE,
  total_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  total_time INTEGER DEFAULT 0 -- in seconds
);

-- Individual questions in a session
CREATE TABLE public.session_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.question_sessions(id) ON DELETE CASCADE,
  question_template_id UUID REFERENCES public.question_templates(id),
  question_text TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  user_answer TEXT,
  is_correct BOOLEAN,
  time_taken INTEGER, -- in seconds
  question_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Question Generation Engine
```typescript
// Core question generation interface
interface QuestionGenerator {
  generateQuestion(template: QuestionTemplate, difficulty: number): GeneratedQuestion;
  validateAnswer(question: GeneratedQuestion, userAnswer: string): ValidationResult;
  calculateScore(question: GeneratedQuestion, timeTaken: number, isCorrect: boolean): number;
}

// Question structure
interface GeneratedQuestion {
  id: string;
  questionText: string;
  correctAnswer: string;
  answerType: 'number' | 'fraction' | 'decimal' | 'percentage' | 'expression';
  difficulty: number;
  timeLimit?: number; // in seconds
  hints?: string[];
  explanation?: string;
}

// Validation result
interface ValidationResult {
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  explanation?: string;
  timePenalty: number; // +5 seconds for wrong answers
}
```

### File Structure
```
lib/
├── math-engine/
│   ├── generators/
│   │   ├── BodmasGenerator.ts
│   │   ├── GridMethodGenerator.ts
│   │   ├── FractionGenerator.ts
│   │   ├── DecimalGenerator.ts
│   │   ├── PercentageGenerator.ts
│   │   └── AlgebraGenerator.ts
│   ├── validators/
│   │   ├── AnswerValidator.ts
│   │   ├── NumberValidator.ts
│   │   ├── FractionValidator.ts
│   │   └── ExpressionValidator.ts
│   ├── scoring/
│   │   ├── ScoreCalculator.ts
│   │   └── PerformanceTracker.ts
│   └── QuestionEngine.ts
├── utils/
│   ├── math-utils.ts
│   ├── fraction-utils.ts
│   └── decimal-utils.ts
└── types/
    ├── question-types.ts
    └── math-types.ts

components/
├── questions/
│   ├── QuestionDisplay.tsx
│   ├── AnswerInput.tsx
│   ├── MultipleChoiceInput.tsx
│   ├── NumberInput.tsx
│   ├── FractionInput.tsx
│   └── FeedbackDisplay.tsx
└── game/
    ├── QuestionTimer.tsx
    └── ScoreTracker.tsx
```

## Implementation Tasks

1. **Question Template System**
   - Create question templates for each math topic
   - Implement parameter-based generation
   - Set up difficulty scaling algorithms

2. **Generator Implementation**
   - Build BODMAS question generator
   - Implement Grid Method multiplication problems
   - Create fraction operation generators
   - Develop decimal calculation generators
   - Build percentage problem generators
   - Implement algebra expression generators

3. **Answer Validation System**
   - Create flexible answer validation
   - Handle multiple answer formats
   - Implement tolerance for rounding errors
   - Add fraction simplification checking

4. **Scoring and Performance**
   - Implement time-based scoring
   - Add accuracy tracking
   - Create performance analytics
   - Build adaptive difficulty system

5. **UI Components**
   - Design question display components
   - Create input methods for different answer types
   - Implement real-time feedback
   - Add progress indicators

6. **Session Management**
   - Track question sessions
   - Store individual question results
   - Implement session recovery
   - Add performance analytics

## Question Generation Examples

### BODMAS Questions
```typescript
// Level 1: Simple addition to 10
generateBodmasQuestion(level: 1): GeneratedQuestion {
  const a = Math.floor(Math.random() * 9) + 1; // 1-9
  const b = 10 - a;
  return {
    questionText: `${a} + ? = 10`,
    correctAnswer: b.toString(),
    answerType: 'number',
    difficulty: 1
  };
}

// Level 2: 2-3 digit addition
generateBodmasQuestion(level: 2): GeneratedQuestion {
  const a = Math.floor(Math.random() * 900) + 100; // 100-999
  const b = Math.floor(Math.random() * 900) + 100; // 100-999
  return {
    questionText: `${a} + ${b} = ?`,
    correctAnswer: (a + b).toString(),
    answerType: 'number',
    difficulty: 2
  };
}
```

### Fraction Questions
```typescript
// Level 1: Simple fraction addition
generateFractionQuestion(level: 1): GeneratedQuestion {
  const num1 = Math.floor(Math.random() * 8) + 1; // 1-8
  const den1 = Math.floor(Math.random() * 8) + 1; // 1-8
  const num2 = Math.floor(Math.random() * 8) + 1; // 1-8
  const den2 = Math.floor(Math.random() * 8) + 1; // 1-8
  
  const result = addFractions(num1, den1, num2, den2);
  
  return {
    questionText: `${num1}/${den1} + ${num2}/${den2} = ?`,
    correctAnswer: `${result.numerator}/${result.denominator}`,
    answerType: 'fraction',
    difficulty: 1
  };
}
```

### Grid Method Questions
```typescript
// Level 1: 1-digit multiplication
generateGridMethodQuestion(level: 1): GeneratedQuestion {
  const a = Math.floor(Math.random() * 9) + 1; // 1-9
  const b = Math.floor(Math.random() * 9) + 1; // 1-9
  
  return {
    questionText: `${a} × ${b} = ?`,
    correctAnswer: (a * b).toString(),
    answerType: 'number',
    difficulty: 1,
    explanation: `Use the grid method: ${a} × ${b} = ${a * b}`
  };
}
```

## Validation Gates

### Unit Tests
```bash
# Test question generation
npm run test:generators

# Test answer validation
npm run test:validators

# Test scoring system
npm run test:scoring
```

### Integration Tests
```bash
# Test full question flow
npm run test:question-flow

# Test session management
npm run test:sessions
```

### Manual Testing Checklist
- [ ] All question types generate correctly
- [ ] Answer validation handles edge cases
- [ ] Scoring system is accurate
- [ ] Difficulty progression works
- [ ] Session tracking is reliable
- [ ] Performance analytics are correct

## Error Handling Strategy

### Generation Errors
- **Invalid Parameters**: Fallback to simpler questions
- **Math Errors**: Validation and correction
- **Template Issues**: Default question fallback

### Validation Errors
- **Format Issues**: Clear error messages
- **Rounding Errors**: Accept reasonable tolerance
- **Input Parsing**: Graceful error handling

### Performance Errors
- **Slow Generation**: Caching and optimization
- **Memory Issues**: Efficient data structures
- **Network Problems**: Offline question generation

## Performance Requirements

- **Question Generation**: < 100ms per question
- **Answer Validation**: < 50ms per validation
- **Session Creation**: < 200ms
- **Score Calculation**: < 50ms
- **Mobile Performance**: Smooth on low-end devices

## Accessibility Features

- **Screen Reader Support**: Proper ARIA labels
- **Keyboard Navigation**: Full keyboard support
- **High Contrast**: Alternative color schemes
- **Font Scaling**: Responsive text sizing
- **Audio Feedback**: Optional sound cues

## Success Criteria

- [ ] All 6 math topics generate appropriate questions
- [ ] Answer validation is accurate and flexible
- [ ] Scoring system rewards speed and accuracy
- [ ] Difficulty progression is smooth
- [ ] Session management is reliable
- [ ] Performance meets requirements
- [ ] Mobile experience is optimized

## Confidence Score: 9/10

This PRP provides comprehensive guidance for implementing a robust math question generation system with proper validation, scoring, and performance tracking, following educational best practices and technical requirements.
