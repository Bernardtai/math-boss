# PRP: Global Leaderboard with Country Rankings

## Feature: Competitive Leaderboard System

Implement a global leaderboard system that displays top performers by lesson, country, and age group, encouraging competition and showcasing the "Asian Way" of math mastery while maintaining user privacy and fair competition.

## Research Context

### Gamification Psychology
- **Social Competition**: Global rankings motivate improvement
- **Country Pride**: National representation drives engagement
- **Age-Appropriate Competition**: Fair comparison within age groups
- **Achievement Recognition**: Public acknowledgment of success

### Key Requirements from Idea Analysis
- Show best performers by lesson
- Display country, user name, age, and achievement date
- Only boss level scores count for leaderboard
- Global visibility to showcase Asian math methods
- Privacy-conscious display (no personal details)

## Implementation Blueprint

### Database Schema
```sql
-- Leaderboard entries (only boss levels)
CREATE TABLE public.leaderboard_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  level_id TEXT REFERENCES public.levels(id) ON DELETE CASCADE,
  lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  time_taken INTEGER NOT NULL, -- in seconds
  country TEXT NOT NULL,
  user_age INTEGER NOT NULL, -- calculated from date_of_birth
  display_name TEXT NOT NULL, -- user-chosen display name
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_boss_level BOOLEAN DEFAULT TRUE,
  rank_position INTEGER, -- calculated rank
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Country statistics
CREATE TABLE public.country_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  country TEXT NOT NULL,
  lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  total_players INTEGER DEFAULT 0,
  average_score DECIMAL(10,2) DEFAULT 0,
  top_score INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(country, lesson_id)
);

-- Age group statistics
CREATE TABLE public.age_group_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  age_group TEXT NOT NULL, -- '8-10', '11-13', '14-16', '17+'
  lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  total_players INTEGER DEFAULT 0,
  average_score DECIMAL(10,2) DEFAULT 0,
  top_score INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(age_group, lesson_id)
);
```

### Component Architecture
```
app/
├── leaderboard/
│   ├── page.tsx                    # Main leaderboard overview
│   ├── [lessonId]/
│   │   └── page.tsx               # Lesson-specific leaderboard
│   ├── countries/
│   │   └── page.tsx               # Country rankings
│   └── age-groups/
│       └── page.tsx               # Age group rankings

components/
├── leaderboard/
│   ├── LeaderboardTable.tsx       # Main leaderboard display
│   ├── LeaderboardCard.tsx        # Individual entry card
│   ├── CountryRanking.tsx         # Country-specific rankings
│   ├── AgeGroupRanking.tsx        # Age group rankings
│   ├── LessonSelector.tsx         # Filter by lesson
│   └── RankingFilters.tsx         # Filter controls
├── stats/
│   ├── CountryStats.tsx           # Country performance stats
│   ├── AgeGroupStats.tsx          # Age group performance
│   └── GlobalStats.tsx            # Overall statistics
└── achievements/
    ├── AchievementBadge.tsx       # Achievement display
    └── TrophyDisplay.tsx          # Trophy/medal system
```

### Ranking Algorithm
```typescript
// Leaderboard calculation logic
interface LeaderboardEntry {
  userId: string;
  displayName: string;
  country: string;
  age: number;
  score: number;
  timeTaken: number;
  achievedAt: Date;
  rank: number;
}

// Ranking calculation
function calculateRankings(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return entries
    .sort((a, b) => {
      // Primary: Score (higher is better)
      if (a.score !== b.score) return b.score - a.score;
      // Secondary: Time (lower is better)
      return a.timeTaken - b.timeTaken;
    })
    .map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
}

// Age group categorization
function getAgeGroup(age: number): string {
  if (age <= 10) return '8-10';
  if (age <= 13) return '11-13';
  if (age <= 16) return '14-16';
  return '17+';
}
```

## Implementation Tasks

1. **Database Setup**
   - Create leaderboard tables
   - Set up indexes for performance
   - Implement RLS policies for privacy

2. **Ranking System**
   - Implement score-based ranking algorithm
   - Add time-based tie-breaking
   - Create rank calculation functions

3. **Data Aggregation**
   - Build country statistics calculation
   - Implement age group analytics
   - Create performance metrics

4. **UI Components**
   - Design responsive leaderboard tables
   - Create country ranking displays
   - Build age group comparisons

5. **Real-time Updates**
   - Implement leaderboard refresh
   - Add new entry notifications
   - Create rank change tracking

6. **Privacy Protection**
   - Implement display name system
   - Add data anonymization
   - Create privacy controls

## Leaderboard Display Logic

### Main Leaderboard View
```typescript
// Global leaderboard with filters
interface LeaderboardFilters {
  lessonId?: string;
  country?: string;
  ageGroup?: string;
  timeRange?: 'week' | 'month' | 'all';
  limit?: number;
}

// Leaderboard data structure
interface LeaderboardData {
  entries: LeaderboardEntry[];
  totalEntries: number;
  userRank?: number;
  countryRank?: number;
  ageGroupRank?: number;
}
```

### Country Rankings
```typescript
// Country performance metrics
interface CountryStats {
  country: string;
  totalPlayers: number;
  averageScore: number;
  topScore: number;
  rank: number;
  flag: string; // emoji or image URL
  topPlayers: LeaderboardEntry[];
}
```

### Age Group Rankings
```typescript
// Age group performance
interface AgeGroupStats {
  ageGroup: string;
  totalPlayers: number;
  averageScore: number;
  topScore: number;
  rank: number;
  topPlayers: LeaderboardEntry[];
}
```

## Validation Gates

### Performance Tests
```bash
# Test leaderboard queries
npm run test:leaderboard-queries

# Test ranking calculations
npm run test:ranking-algorithm

# Test data aggregation
npm run test:stats-calculation
```

### Database Tests
```sql
-- Verify leaderboard data integrity
SELECT 
  lesson_id,
  COUNT(*) as total_entries,
  AVG(score) as avg_score,
  MAX(score) as top_score
FROM leaderboard_entries 
GROUP BY lesson_id;

-- Check country statistics
SELECT 
  country,
  COUNT(DISTINCT user_id) as unique_players,
  AVG(score) as avg_score
FROM leaderboard_entries 
GROUP BY country 
ORDER BY avg_score DESC;
```

### Manual Testing Checklist
- [ ] Leaderboard displays correctly for all lessons
- [ ] Rankings are calculated accurately
- [ ] Country filters work properly
- [ ] Age group comparisons are fair
- [ ] Real-time updates function correctly
- [ ] Privacy settings are respected
- [ ] Mobile display is responsive

## Privacy and Security

### Data Protection
- **Display Names**: Users choose public display names
- **Age Ranges**: Show age groups, not exact ages
- **Country Display**: Show country flags/names only
- **Personal Data**: No email or personal info displayed

### Privacy Controls
```typescript
// User privacy settings
interface PrivacySettings {
  showOnLeaderboard: boolean;
  displayName: string;
  showCountry: boolean;
  showAgeGroup: boolean;
  allowCountryRanking: boolean;
}
```

### Data Anonymization
- Remove personal identifiers from public data
- Aggregate statistics without individual tracking
- Implement data retention policies
- Provide data deletion options

## Performance Requirements

- **Leaderboard Load**: < 2 seconds for main view
- **Filter Updates**: < 1 second for filter changes
- **Rank Calculations**: < 500ms for updates
- **Country Stats**: < 1 second for country view
- **Mobile Performance**: Smooth scrolling and interactions

## Real-time Features

### Live Updates
- WebSocket connections for real-time updates
- Push notifications for rank changes
- Live leaderboard refresh
- Achievement notifications

### Caching Strategy
- Redis cache for leaderboard data
- CDN caching for static leaderboard views
- Database query optimization
- Background rank recalculation

## Success Criteria

- [ ] Global leaderboard displays top performers accurately
- [ ] Country rankings showcase national performance
- [ ] Age group comparisons are fair and motivating
- [ ] Real-time updates work smoothly
- [ ] Privacy protection is comprehensive
- [ ] Mobile experience is engaging
- [ ] Performance meets requirements
- [ ] Asian math methods are prominently featured

## Confidence Score: 8/10

This PRP provides comprehensive guidance for implementing a competitive leaderboard system that balances engagement with privacy, following gamification best practices and educational psychology principles.
