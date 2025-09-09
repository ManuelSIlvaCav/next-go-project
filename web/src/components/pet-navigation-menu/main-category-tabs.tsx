'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MainCategory } from './types'

interface MainCategoryTabsProps {
  categories: MainCategory[]
  activeCategory: string
  onCategoryChange: (categoryId: string) => void
}

export default function MainCategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}: MainCategoryTabsProps) {
  return (
    <div className="border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-center space-x-2 sm:space-x-4 lg:space-x-8 py-3 px-4 overflow-x-auto">
        {categories.map((category) => (
          <Button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            variant="ghost"
            className={cn(
              'flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg font-fredoka font-medium transition-colors whitespace-nowrap',
              'min-w-fit flex-shrink-0',
              activeCategory === category.id
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'text-gray-700 hover:text-primary hover:bg-gray-50 dark:text-gray-200 dark:hover:text-primary dark:hover:bg-gray-800'
            )}
          >
            <span className="text-base sm:text-lg">{category.icon}</span>
            <span className="text-sm sm:text-base font-medium">{category.name}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
