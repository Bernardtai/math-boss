import { cn } from '@/lib/utils'

interface PageWrapperProps {
  children: React.ReactNode
  className?: string
  centered?: boolean
}

export function PageWrapper({ children, className, centered = false }: PageWrapperProps) {
  return (
    <div 
      className={cn(
        'min-h-screen pt-20 pb-12',
        centered && 'flex items-center justify-center',
        className
      )}
    >
      {children}
    </div>
  )
}

