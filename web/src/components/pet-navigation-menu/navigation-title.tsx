import { cn } from '@/lib/utils'

interface NavigationTitleProps {
  children: React.ReactNode
  className?: string
  variant?: 'main' | 'section' | 'mobile'
}

export default function NavigationTitle({ 
  children, 
  className,
  variant = 'main'
}: NavigationTitleProps) {
  const baseClasses = 'font-fredoka font-bold dark:text-white'
  
  const variantClasses = {
    main: 'text-lg sm:text-xl lg:text-2xl text-gray-900',
    section: 'text-base sm:text-lg text-gray-800 dark:text-gray-100',
    mobile: 'text-lg text-gray-900'
  }

  return (
    <h1 className={cn(baseClasses, variantClasses[variant], className)}>
      {children}
    </h1>
  )
}
