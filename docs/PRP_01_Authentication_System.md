# PRP: Google OAuth Authentication System

## Feature: User Authentication with Google OAuth

Implement a secure authentication system using Google OAuth for the Math Boss learning platform, enabling users to sign in with their Google accounts and manage their learning progress.

## Research Context

### Tech Stack Analysis
- **Next.js 14**: App Router with server-side authentication
- **Supabase**: Backend-as-a-Service with built-in OAuth support
- **Google OAuth 2.0**: Industry standard for educational apps
- **Mobile-first**: Responsive design for all devices

### Key Requirements from Idea Analysis
- Free access for all users
- User profile with name, country, date of birth, avatar
- Progress tracking across lessons
- Global leaderboard participation
- Age-based user categorization

## Implementation Blueprint

### Database Schema (Supabase)
```sql
-- Users table (extends Supabase auth.users)
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

-- User progress tracking
CREATE TABLE public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  level_id TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  time_taken INTEGER, -- in seconds
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_boss_level BOOLEAN DEFAULT FALSE
);
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

### File Structure
```
app/
├── auth/
│   ├── login/
│   │   └── page.tsx
│   └── callback/
│       └── page.tsx
├── profile/
│   ├── page.tsx
│   └── edit/
│       └── page.tsx
├── middleware.ts
└── layout.tsx

lib/
├── supabase/
│   ├── client.ts
│   ├── server.ts
│   └── middleware.ts
└── auth/
    ├── auth-helpers.ts
    └── profile-helpers.ts

components/
├── auth/
│   ├── LoginButton.tsx
│   ├── LogoutButton.tsx
│   └── AuthGuard.tsx
└── profile/
    ├── ProfileCard.tsx
    └── ProfileForm.tsx
```

## Implementation Tasks

1. **Setup Supabase Project**
   - Create new Supabase project
   - Configure Google OAuth provider
   - Set up database tables and RLS policies

2. **Install Dependencies**
   - @supabase/supabase-js
   - @supabase/ssr
   - @supabase/auth-helpers-nextjs

3. **Configure Environment Variables**
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY

4. **Implement Authentication Components**
   - Login/logout buttons with Google branding
   - Protected route middleware
   - Auth state management

5. **Create Profile Management**
   - Profile creation on first login
   - Profile editing form with validation
   - Avatar upload functionality

6. **Add Error Handling**
   - OAuth callback error handling
   - Network error recovery
   - User-friendly error messages

## Validation Gates

### Authentication Tests
```bash
# Test Google OAuth flow
npm run test:auth

# Test protected routes
npm run test:middleware

# Test profile management
npm run test:profile
```

### Manual Testing Checklist
- [ ] Google OAuth login works on mobile and desktop
- [ ] User profile auto-created on first login
- [ ] Profile editing saves correctly
- [ ] Logout clears session properly
- [ ] Protected routes redirect to login
- [ ] Error handling works for network issues

### Database Validation
```sql
-- Verify user profiles are created
SELECT COUNT(*) FROM public.profiles;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';
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

## Success Criteria

- [ ] Users can sign in with Google OAuth
- [ ] Profile data is securely stored and managed
- [ ] Authentication state persists across sessions
- [ ] Mobile-responsive authentication flow
- [ ] Error handling provides clear user feedback
- [ ] All security best practices implemented

## Confidence Score: 9/10

This PRP provides comprehensive context for implementing a production-ready authentication system with Google OAuth, following Next.js and Supabase best practices for educational applications.
