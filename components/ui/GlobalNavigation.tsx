'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, BookOpen, Trophy, User, Sparkles } from 'lucide-react'

const navigation = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
  },
  {
    name: 'Lessons',
    href: '/lessons',
    icon: BookOpen,
  },
  {
    name: 'Leaderboard',
    href: '/leaderboard',
    icon: Trophy,
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
  },
]

export function GlobalNavigation() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center space-x-6 ml-8">
      {navigation.map((item) => {
        const isActive = pathname === item.href ||
                        (item.href !== '/' && pathname.startsWith(item.href))
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}

// Mobile navigation component
export function MobileNavigation() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden flex flex-col space-y-2 p-4 border-t border-border bg-background/95 backdrop-blur-sm">
      {navigation.map((item) => {
        const isActive = pathname === item.href ||
                        (item.href !== '/' && pathname.startsWith(item.href))
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md transition-colors',
              isActive
                ? 'bg-primary/10 text-primary border-l-2 border-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}
