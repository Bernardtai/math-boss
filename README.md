# Math Boss - Asian Math Learning Platform

A web application that shares the "Asian Way" of daily math drills to help students worldwide improve their mathematical skills through gamified learning experiences.

## 🎯 Project Overview

**Problem**: Western parents believe Asian kids are naturally better at math (PISA 2022 ranks Asian countries in top 5, US at #28), yet existing programs like Kumon show only 20% improvement after 6 months despite $2,000-$3,000 annual costs.

**Solution**: Math Boss transforms traditional Asian math practice methods into engaging, short challenges with global leaderboards, making repetitive practice fun and trackable.

## 🌟 Key Features

### 📚 Learning Islands
- **Progressive Learning**: Islands unlock based on performance
- **Two Levels per Pair**: Regular levels + Boss challenges
- **Boss Levels**: 
  - Boss 1: Harder calculations of current level
  - Boss 2: Mixed calculations from entire island
  - Only boss scores count for leaderboards

### 🎮 Gamified Experience
- **Speed & Accuracy**: 5-20 questions per session
- **Time Penalties**: +5 seconds for wrong answers
- **Global Competition**: Race against best times worldwide
- **Progress Tracking**: Visual charts showing improvement

### 📖 Math Topics Covered
1. **BODMAS** - Order of operations fundamentals
2. **Grid Method** - Fast multiplication techniques
3. **Fraction Calculations** - Mixed operations with fractions
4. **Decimal Operations** - All four operations with decimals
5. **Percentage Basics** - Percentage calculations
6. **Algebra** - Basic algebraic expressions

## 🛠️ Tech Stack

- **Frontend**: Next.js, Shadcn UI
- **Backend**: Supabase (Authentication & Database)
- **Hosting**: Vercel
- **Design**: Mobile-first, responsive for all devices

## 📱 App Structure

### Page 1: Main Page
- Project introduction and target market
- "How to use this website" tutorial
- About Us section

### Page 2: Lessons
- Visual island-based lesson selection
- Locked/unlocked lesson indicators
- Progress tracking and unlock requirements

### Page 3: Leaderboard
- Global rankings by lesson
- Country-based performance display
- User names, ages, and achievement dates

### Page 4: Profile/Progress
- User profile management
- Detailed progress charts
- Performance analytics

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Bernardtai/math-boss.git
cd math-boss
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Add your Supabase credentials
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Development Process

This project uses a structured development approach with PRPs (Project Requirements & Plans):

- **`docs/prps_create.md`**: Template for creating comprehensive feature plans
- **`docs/prps_execute.md`**: Process for implementing features from PRPs
- **`docs/idea.txt`**: Original project concept and detailed specifications

## 🎯 Target Audience

- **Primary**: Students aged 8-16 seeking math improvement
- **Secondary**: Parents looking for effective, engaging math practice
- **Global**: Anyone wanting to learn the "Asian method" of math mastery

## 🌍 Mission

To democratize access to the proven Asian math learning methods that have consistently produced top-performing students globally, making these techniques accessible, engaging, and free for students worldwide.

## 📄 License

This project is open source and free to use for educational purposes.

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines and submit pull requests for any improvements.

## 📞 Contact

For questions or support, please open an issue on GitHub or contact the development team.

---

*Making math mastery accessible to everyone, one challenge at a time.*
