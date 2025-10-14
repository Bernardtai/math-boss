# PRP: Project Setup & Authentication System

## Feature: Complete Project Initialization & User Authentication

Implement a comprehensive development environment setup and secure authentication system for the Math Boss learning platform, covering project initialization, dependency management, Supabase configuration, and Google OAuth integration.

## Development Environment Setup

### Prerequisites
- **Node.js**: Version 18.17 or later
- **npm**: Version 9.0 or later (comes with Node.js)
- **Git**: Version control system
- **Google Account**: For OAuth configuration
- **Supabase Account**: For backend services

### Quick Start Commands
```bash
# Clone the repository
git clone <repository-url>
cd "Boss Math"

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

## Tech Stack Setup

### Core Technologies
- **Next.js 14**: App Router with server-side rendering
- **Supabase**: Backend-as-a-Service with authentication and database
- **Shadcn UI**: Modern component library with Tailwind CSS
- **TypeScript**: Type-safe development
- **Framer Motion**: Smooth animations and transitions

### Development Tools
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting consistency
- **Husky**: Pre-commit hooks
- **Tailwind CSS**: Utility-first CSS framework

## Implementation Blueprint

### Database Schema (Supabase)

#### Core Tables Setup
```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  country TEXT,
  date_of_birth DATE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content structure
CREATE TABLE public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  color_theme TEXT,
  order_index INTEGER UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.levels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level_type TEXT CHECK (level_type IN ('normal', 'boss')) DEFAULT 'normal',
  unlock_requirements JSONB,
  question_count INTEGER DEFAULT 10,
  time_limit INTEGER, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.question_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  level_id UUID REFERENCES public.levels(id) ON DELETE CASCADE,
  template_type TEXT NOT NULL,
  difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
  template_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress and analytics
CREATE TABLE public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  level_id UUID REFERENCES public.levels(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  time_taken INTEGER, -- in seconds
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  attempts INTEGER DEFAULT 1,
  is_boss_level BOOLEAN DEFAULT FALSE
);

CREATE TABLE public.user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress_value INTEGER DEFAULT 0
);

-- Competition and leaderboards
CREATE TABLE public.leaderboard_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  level_id UUID REFERENCES public.levels(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  time_taken INTEGER NOT NULL,
  country TEXT,
  user_age INTEGER,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.country_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  country TEXT NOT NULL,
  level_id UUID REFERENCES public.levels(id) ON DELETE CASCADE,
  total_players INTEGER DEFAULT 0,
  average_score DECIMAL(5,2) DEFAULT 0,
  top_score INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(country, level_id)
);

CREATE TABLE public.learning_streaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Row Level Security (RLS) Policies
```sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_streaks ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only access their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- User Progress: Users can only access their own progress
CREATE POLICY "Users can view own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Leaderboard: Public read access for global leaderboards
CREATE POLICY "Anyone can view leaderboard" ON public.leaderboard_entries
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own leaderboard entries" ON public.leaderboard_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Content tables: Public read access
CREATE POLICY "Anyone can view lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Anyone can view levels" ON public.levels FOR SELECT USING (true);
CREATE POLICY "Anyone can view question templates" ON public.question_templates FOR SELECT USING (true);
```

### Authentication Flow
1. **Google OAuth Setup**
   - Configure Google OAuth in Supabase dashboard
   - Set up redirect URLs for development and production
   - Configure scopes: email, profile

2. **Next.js Integration**
   - Use Supabase Auth helpers for Next.js
   - Implement middleware for route protection
   - Handle authentication state management

3. **User Profile Management**
   - Auto-create profile on first login
   - Allow profile editing (name, country, avatar)
   - Calculate age from date of birth

### Project Structure & File Organization

#### Complete Directory Structure
```
math-boss/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── callback/
│   │       └── route.ts
│   ├── (dashboard)/              # Protected route group
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   ├── page.tsx
│   │   │   └── edit/
│   │   │       └── page.tsx
│   │   └── lessons/
│   │       └── page.tsx
│   ├── api/                      # API routes
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── loading.tsx               # Loading UI
│   ├── not-found.tsx             # 404 page
│   └── page.tsx                  # Home page
├── components/                   # Reusable UI components
│   ├── ui/                       # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── auth/                     # Authentication components
│   │   ├── LoginButton.tsx
│   │   ├── LogoutButton.tsx
│   │   ├── AuthGuard.tsx
│   │   └── UserMenu.tsx
│   ├── profile/                  # Profile management
│   │   ├── ProfileCard.tsx
│   │   ├── ProfileForm.tsx
│   │   └── AvatarUpload.tsx
│   ├── lessons/                  # Lesson components
│   │   ├── LessonCard.tsx
│   │   ├── LevelProgress.tsx
│   │   └── QuestionDisplay.tsx
│   ├── leaderboard/              # Leaderboard components
│   │   ├── LeaderboardTable.tsx
│   │   └── CountryStats.tsx
│   └── layout/                   # Layout components
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
├── lib/                          # Utility functions & configurations
│   ├── supabase/                 # Supabase configuration
│   │   ├── client.ts
│   │   ├── server.ts
│   │   ├── middleware.ts
│   │   └── types.ts
│   ├── auth/                     # Authentication helpers
│   │   ├── auth-helpers.ts
│   │   └── profile-helpers.ts
│   ├── math-engine/              # Math question generation
│   │   ├── generators/
│   │   ├── validators/
│   │   └── types.ts
│   ├── utils/                    # General utilities
│   │   ├── cn.ts
│   │   ├── formatters.ts
│   │   └── constants.ts
│   └── validations/              # Form validations
│       ├── auth.ts
│       └── profile.ts
├── types/                        # TypeScript type definitions
│   ├── database.ts
│   ├── api.ts
│   └── components.ts
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts
│   ├── useProfile.ts
│   ├── useLessons.ts
│   └── useLeaderboard.ts
├── constants/                    # Application constants
│   ├── lessons.ts
│   ├── achievements.ts
│   └── themes.ts
├── public/                       # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
├── docs/                         # Documentation
│   ├── PRP_*.md
│   └── README.md
├── .env.example                  # Environment variables template
├── .env.local                    # Local environment (gitignored)
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── components.json               # Shadcn UI config
└── README.md
```

#### Key Files Configuration

**package.json** (Essential Scripts)
```json
{
  "name": "math-boss",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "db:generate": "supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > lib/supabase/types.ts",
    "db:push": "supabase db push",
    "db:reset": "supabase db reset",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.38.4",
    "@supabase/ssr": "^0.0.10",
    "@supabase/auth-helpers-nextjs": "^0.8.7",
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@radix-ui/react-slot": "^1.0.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "tailwindcss": "^3.3.6",
    "framer-motion": "^10.16.16",
    "lucide-react": "^0.294.0",
    "zod": "^3.22.4",
    "react-hook-form": "^7.48.2",
    "@hookform/resolvers": "^3.3.2"
  },
  "devDependencies": {
    "@types/node": "^20.10.5",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "typescript": "^5.3.3",
    "eslint": "^8.55.0",
    "eslint-config-next": "14.0.4",
    "prettier": "^3.1.1",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "husky": "^8.0.3",
    "lint-staged": "^15.2.0",
    "supabase": "^1.110.1",
    "@playwright/test": "^1.40.1",
    "jest": "^29.7.0",
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5"
  }
}
```

**tailwind.config.js**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // Add math-themed colors
        math: {
          addition: "#22c55e",
          subtraction: "#ef4444",
          multiplication: "#3b82f6",
          division: "#f59e0b",
        }
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

**next.config.js**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  },
}

module.exports = nextConfig
```

## Step-by-Step Implementation Guide

### Phase 1: Project Foundation (1-2 hours)

1. **Initialize Next.js Project**
   ```bash
   npx create-next-app@latest math-boss --typescript --tailwind --eslint --app
   cd math-boss
   npm install
   ```

2. **Install Core Dependencies**
   ```bash
   # Supabase packages
   npm install @supabase/supabase-js @supabase/ssr @supabase/auth-helpers-nextjs

   # UI components
   npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge
   npm install framer-motion lucide-react

   # Form handling
   npm install zod react-hook-form @hookform/resolvers

   # Development tools
   npm install -D @types/node @types/react @types/react-dom
   npm install -D eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser
   npm install -D husky lint-staged supabase
   ```

3. **Initialize Supabase Project**
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Login to Supabase
   supabase login

   # Initialize local Supabase project
   supabase init

   # Start local Supabase
   supabase start
   ```

4. **Setup Shadcn UI**
   ```bash
   npx shadcn-ui@latest init
   npx shadcn-ui@latest add button card input
   ```

### Phase 2: Environment & Configuration (30-45 minutes)

1. **Create Environment Variables**
   ```bash
   # Copy the .env.example file (we'll create this next)
   cp .env.example .env.local
   ```

2. **Configure Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Create new project
   - Note down project URL and API keys
   - Configure Google OAuth provider

3. **Database Setup**
   ```bash
   # Run the SQL schema in Supabase SQL editor or via CLI
   supabase db push

   # Generate TypeScript types
   supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts
   ```

### Phase 3: Core Authentication (1-2 hours)

1. **Supabase Configuration Files**
   - Create `lib/supabase/client.ts`
   - Create `lib/supabase/server.ts`
   - Create `lib/supabase/middleware.ts`

2. **Authentication Components**
   - Implement `LoginButton.tsx`
   - Create `AuthGuard.tsx` component
   - Add middleware for route protection

3. **Profile Management**
   - Create profile creation trigger
   - Implement profile editing forms
   - Add avatar upload functionality

### Phase 4: Basic App Structure (2-3 hours)

1. **App Router Structure**
   - Create route groups for auth and dashboard
   - Implement basic layouts
   - Add loading and error states

2. **Core Components**
   - Header with navigation
   - Sidebar for lessons
   - Basic dashboard layout

3. **Development Environment**
   ```bash
   # Start development server
   npm run dev

   # Run linting
   npm run lint

   # Type checking
   npm run type-check
   ```

### Phase 5: Testing & Validation (30-45 minutes)

1. **Authentication Testing**
   - Test Google OAuth flow
   - Verify profile creation
   - Check middleware protection

2. **Database Validation**
   - Verify RLS policies
   - Test data insertion/retrieval
   - Check foreign key constraints

## Development Commands & Validation

### Essential npm Scripts
```bash
# Development
npm run dev              # Start development server (http://localhost:3000)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format code with Prettier
npm run type-check       # Run TypeScript type checking

# Database
npm run db:generate      # Generate TypeScript types from Supabase
npm run db:push          # Push schema changes to Supabase
npm run db:reset         # Reset local database

# Testing
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:e2e         # Run end-to-end tests
```

### Validation Checklist

#### Environment Setup
- [ ] Node.js 18.17+ installed
- [ ] Supabase CLI installed globally
- [ ] Supabase project created
- [ ] Google OAuth configured in Supabase
- [ ] Environment variables configured

#### Project Initialization
- [ ] Next.js project created with TypeScript
- [ ] All dependencies installed
- [ ] Shadcn UI initialized
- [ ] Tailwind CSS configured
- [ ] ESLint and Prettier configured

#### Database Setup
- [ ] All tables created in Supabase
- [ ] RLS policies applied
- [ ] Database types generated
- [ ] Foreign key constraints working

#### Authentication Flow
- [ ] Google OAuth login working
- [ ] Profile auto-creation on first login
- [ ] Protected routes redirect correctly
- [ ] Logout clears session properly
- [ ] Middleware protecting dashboard routes

#### Development Environment
- [ ] `npm run dev` starts server successfully
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Hot reload working
- [ ] Console shows no runtime errors

### Database Validation Queries
```sql
-- Verify core tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('profiles', 'lessons', 'levels', 'user_progress');

-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'user_progress', 'leaderboard_entries');

-- Verify policies exist
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public';

-- Test data insertion (should work with authenticated user)
-- INSERT INTO public.profiles (id, email, full_name)
-- VALUES ('test-uuid', 'test@example.com', 'Test User');
```

## Error Handling Strategy

### OAuth Errors
- **Access Denied**: Redirect to login with message
- **Network Error**: Retry mechanism with exponential backoff
- **Invalid State**: Clear session and restart flow

### Profile Errors
- **Missing Data**: Show form to complete profile
- **Validation Errors**: Inline field validation
- **Save Failures**: Retry with user notification

## Security Considerations

- **RLS Policies**: Row-level security for user data
- **JWT Validation**: Server-side token verification
- **CSRF Protection**: Built into Supabase Auth
- **Rate Limiting**: Prevent brute force attacks
- **Data Privacy**: GDPR compliance for user data

## Performance Requirements

- **Login Time**: < 3 seconds for OAuth flow
- **Profile Load**: < 1 second for profile data
- **Session Check**: < 500ms for middleware
- **Mobile Performance**: Optimized for 3G networks

## Success Criteria & Next Steps

### Phase 1 Success Criteria
- [ ] Complete project structure created
- [ ] All dependencies installed successfully
- [ ] Supabase project configured with Google OAuth
- [ ] Database schema deployed with RLS policies
- [ ] Environment variables configured
- [ ] Development server starts without errors
- [ ] Basic authentication flow working

### Next Steps After Setup
1. **Implement Core Authentication Components**
   - Complete `LoginButton` and `AuthGuard` components
   - Set up middleware for route protection
   - Create profile management forms

2. **Build Basic UI Structure**
   - Implement dashboard layout
   - Create lesson navigation
   - Add responsive design

3. **Develop Lesson System**
   - Create question generation engine
   - Implement progress tracking
   - Build level unlocking mechanics

4. **Add Gamification Features**
   - Implement leaderboard system
   - Create achievement system
   - Add streak tracking

### Troubleshooting Common Issues

#### Environment Issues
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Clear npm cache if issues
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Supabase Issues
```bash
# Check Supabase status
supabase status

# Reset local database
supabase db reset

# Check logs
supabase logs
```

#### Development Server Issues
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Clear Next.js cache
rm -rf .next

# Restart development server
npm run dev
```

## Confidence Score: 9/10

This comprehensive PRP provides everything needed to set up a complete Math Boss development environment, including project initialization, authentication, database schema, and development workflow. The step-by-step guide ensures developers can get started quickly and avoid common pitfalls.
