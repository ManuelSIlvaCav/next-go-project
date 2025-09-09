'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'
import { MAIN_CATEGORIES } from './data'
import MainCategoryTabs from './main-category-tabs'
import MobileNavigation from './mobile-navigation'
import NavigationTitle from './navigation-title'
import NestedCategories from './nested-categories'
import { PetNavigationMenuProps } from './types'

export default function PetNavigationMenu({ className }: PetNavigationMenuProps) {
  const [activeMainCategory, setActiveMainCategory] = useState<string>('shopping')

  const activeCategories = MAIN_CATEGORIES.find(cat => cat.id === activeMainCategory)?.subcategories || []

  return (
    <div
      className={cn(
        'w-full bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700',
        className,
      )}
    >
      {/* Mobile Navigation */}
      <div className="flex items-center justify-between p-4 lg:hidden">
        <NavigationTitle variant="mobile">
          Menú
        </NavigationTitle>
        <MobileNavigation mainCategories={MAIN_CATEGORIES} />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        {/* First Level - Main Categories */}
        <MainCategoryTabs
          categories={MAIN_CATEGORIES}
          activeCategory={activeMainCategory}
          onCategoryChange={setActiveMainCategory}
        />

        {/* Second Level - Sub Categories */}
        <div className="py-2">
          <NestedCategories categories={activeCategories} />
        </div>
      </div>
    </div>
  )
}
