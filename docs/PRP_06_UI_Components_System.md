# PRP: Responsive UI Components and Mobile-First Design

## Feature: Mobile-First Responsive UI Component System

Implement a comprehensive UI component system using Shadcn UI with mobile-first design principles, creating an engaging and accessible math learning experience that works seamlessly across all devices with smooth animations and intuitive interactions.

## Research Context

### Mobile-First Design Principles
- **Touch-First Interface**: Large touch targets and gesture support
- **Responsive Breakpoints**: Optimized for mobile, tablet, and desktop
- **Performance Optimization**: Fast loading and smooth animations
- **Accessibility**: WCAG 2.1 compliance for inclusive design

### Tech Stack Analysis
- **Next.js 14**: App Router with server-side rendering
- **Shadcn UI**: Modern component library with Tailwind CSS
- **Tailwind CSS**: Utility-first styling with responsive design
- **Framer Motion**: Smooth animations and transitions
- **Radix UI**: Accessible component primitives

## Implementation Blueprint

### Component Architecture
```
components/
├── ui/                           # Shadcn UI components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   ├── progress.tsx
│   ├── badge.tsx
│   ├── avatar.tsx
│   └── ...
├── layout/
│   ├── Header.tsx               # App header with navigation
│   ├── Footer.tsx               # App footer
│   ├── Sidebar.tsx              # Mobile sidebar navigation
│   ├── Navigation.tsx           # Main navigation component
│   └── MobileMenu.tsx           # Mobile hamburger menu
├── game/
│   ├── GameContainer.tsx        # Main game wrapper
│   ├── QuestionCard.tsx         # Question display card
│   ├── AnswerInput.tsx          # Answer input component
│   ├── Timer.tsx                # Game timer display
│   ├── ScoreDisplay.tsx         # Real-time score
│   ├── ProgressBar.tsx          # Question progress
│   └── GameOverModal.tsx        # Game completion modal
├── lessons/
│   ├── LessonGrid.tsx           # Grid of lesson islands
│   ├── LessonCard.tsx           # Individual lesson card
│   ├── LevelCard.tsx            # Level selection card
│   ├── UnlockAnimation.tsx      # Level unlock animation
│   └── ProgressIndicator.tsx    # Lesson progress indicator
├── leaderboard/
│   ├── LeaderboardTable.tsx     # Leaderboard display
│   ├── RankingCard.tsx          # Individual ranking card
│   ├── CountryFlag.tsx          # Country flag display
│   └── TrophyDisplay.tsx        # Trophy/medal display
├── profile/
│   ├── ProfileCard.tsx          # Profile information card
│   ├── AvatarUpload.tsx         # Avatar upload component
│   ├── ProgressChart.tsx        # Progress visualization
│   └── AchievementBadge.tsx     # Achievement display
└── common/
    ├── LoadingSpinner.tsx       # Loading states
    ├── ErrorBoundary.tsx        # Error handling
    ├── Toast.tsx                # Notification system
    └── Confetti.tsx             # Celebration animations
```

### Design System
```typescript
// Design tokens and theme configuration
interface DesignTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    background: string;
    surface: string;
    text: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// Theme configuration
const theme: DesignTokens = {
  colors: {
    primary: '#3b82f6',    // Blue
    secondary: '#8b5cf6',  // Purple
    accent: '#f59e0b',     // Amber
    success: '#10b981',    // Emerald
    warning: '#f59e0b',    // Amber
    error: '#ef4444',      // Red
    background: '#f8fafc', // Slate 50
    surface: '#ffffff',    // White
    text: '#1e293b',       // Slate 800
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
};
```

## Implementation Tasks

1. **Shadcn UI Setup**
   - Install and configure Shadcn UI
   - Set up Tailwind CSS configuration
   - Create custom theme and design tokens
   - Configure component variants

2. **Layout Components**
   - Build responsive header with navigation
   - Create mobile-first sidebar
   - Implement footer component
   - Add mobile menu functionality

3. **Game Interface Components**
   - Design question display cards
   - Create answer input components
   - Build timer and score displays
   - Implement progress indicators

4. **Lesson Components**
   - Create island-based lesson grid
   - Build level selection cards
   - Add unlock animations
   - Implement progress tracking

5. **Interactive Components**
   - Add touch gesture support
   - Implement smooth animations
   - Create loading states
   - Build error handling components

6. **Accessibility Features**
   - Add ARIA labels and descriptions
   - Implement keyboard navigation
   - Create high contrast themes
   - Add screen reader support

## Responsive Design Implementation

### Mobile-First Breakpoints
```css
/* Mobile first approach */
.container {
  @apply px-4 py-2;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    @apply px-6 py-4;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    @apply px-8 py-6;
  }
}
```

### Touch-Friendly Components
```typescript
// Touch-optimized button component
interface TouchButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const TouchButton: React.FC<TouchButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
}) => {
  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        // Touch-friendly sizing
        'min-h-[44px] min-w-[44px]', // Minimum touch target
        // Variants
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
          'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
          'border border-input bg-background hover:bg-accent': variant === 'outline',
        },
        // Sizes
        {
          'h-9 px-3 text-sm': size === 'sm',
          'h-10 px-4 py-2': size === 'md',
          'h-11 px-8 text-lg': size === 'lg',
        }
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
```

### Game Interface Components
```typescript
// Question display card
const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  timeRemaining,
}) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <Badge variant="outline">
            Question {questionNumber} of {totalQuestions}
          </Badge>
          <Timer timeRemaining={timeRemaining} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {question.questionText}
          </h2>
        </div>
        <ProgressBar
          current={questionNumber}
          total={totalQuestions}
          className="w-full"
        />
      </CardContent>
    </Card>
  );
};

// Answer input component
const AnswerInput: React.FC<AnswerInputProps> = ({
  answerType,
  onSubmit,
  disabled = false,
}) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim() && !disabled) {
      onSubmit(answer.trim());
      setAnswer('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="answer">Your Answer</Label>
        <Input
          id="answer"
          type={answerType === 'number' ? 'number' : 'text'}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter your answer..."
          disabled={disabled}
          className="text-lg text-center"
          autoFocus
        />
      </div>
      <TouchButton
        type="submit"
        size="lg"
        className="w-full"
        disabled={!answer.trim() || disabled}
      >
        Submit Answer
      </TouchButton>
    </form>
  );
};
```

## Animation and Interaction

### Framer Motion Integration
```typescript
// Smooth page transitions
const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
};

// Level unlock animation
const UnlockAnimation: React.FC<UnlockAnimationProps> = ({ isUnlocked }) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: isUnlocked ? 1 : 0.8, 
        opacity: isUnlocked ? 1 : 0.6 
      }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'relative overflow-hidden rounded-lg',
        isUnlocked ? 'ring-2 ring-primary' : 'grayscale'
      )}
    >
      {isUnlocked && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"
        />
      )}
    </motion.div>
  );
};
```

## Validation Gates

### Component Tests
```bash
# Test component rendering
npm run test:components

# Test responsive behavior
npm run test:responsive

# Test accessibility
npm run test:a11y
```

### Visual Regression Tests
```bash
# Test visual consistency
npm run test:visual

# Test cross-browser compatibility
npm run test:browser
```

### Performance Tests
```bash
# Test component performance
npm run test:performance

# Test animation smoothness
npm run test:animations
```

### Manual Testing Checklist
- [ ] All components render correctly on mobile
- [ ] Touch interactions work smoothly
- [ ] Animations are smooth and performant
- [ ] Accessibility features function properly
- [ ] Responsive design works across all breakpoints
- [ ] Loading states provide good user feedback
- [ ] Error states are user-friendly
- [ ] Dark mode support works correctly

## Accessibility Implementation

### ARIA Labels and Descriptions
```typescript
// Accessible question component
const AccessibleQuestion: React.FC<AccessibleQuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
}) => {
  return (
    <div
      role="main"
      aria-labelledby="question-title"
      aria-describedby="question-description"
    >
      <h1 id="question-title" className="sr-only">
        Question {questionNumber} of {totalQuestions}
      </h1>
      <p id="question-description" className="sr-only">
        {question.questionText}
      </p>
      <div className="text-2xl font-bold text-center">
        {question.questionText}
      </div>
    </div>
  );
};
```

### Keyboard Navigation
```typescript
// Keyboard-accessible game interface
const KeyboardGameInterface: React.FC<KeyboardGameInterfaceProps> = ({
  onAnswerSubmit,
  onSkip,
}) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onAnswerSubmit();
      } else if (e.key === 'Escape') {
        onSkip();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [onAnswerSubmit, onSkip]);

  return (
    <div className="space-y-4">
      {/* Game interface components */}
    </div>
  );
};
```

## Performance Optimization

### Component Optimization
```typescript
// Memoized components for performance
const MemoizedQuestionCard = React.memo(QuestionCard);
const MemoizedAnswerInput = React.memo(AnswerInput);

// Lazy loading for heavy components
const LazyProgressChart = React.lazy(() => import('./ProgressChart'));
const LazyLeaderboard = React.lazy(() => import('./Leaderboard'));
```

### Bundle Optimization
```typescript
// Dynamic imports for route-based code splitting
const ProfilePage = dynamic(() => import('../app/profile/page'), {
  loading: () => <LoadingSpinner />,
});

const LeaderboardPage = dynamic(() => import('../app/leaderboard/page'), {
  loading: () => <LoadingSpinner />,
});
```

## Success Criteria

- [ ] Mobile-first design works perfectly on all devices
- [ ] Touch interactions are smooth and responsive
- [ ] Animations enhance user experience without performance issues
- [ ] Accessibility features meet WCAG 2.1 standards
- [ ] Component library is consistent and maintainable
- [ ] Loading states provide clear user feedback
- [ ] Error handling is user-friendly
- [ ] Performance meets requirements on all devices

## Confidence Score: 9/10

This PRP provides comprehensive guidance for implementing a mobile-first, accessible UI component system using modern web technologies, following best practices for educational applications and user experience design.
