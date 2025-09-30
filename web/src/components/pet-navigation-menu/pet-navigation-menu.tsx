'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useCategories } from './hooks'
import MainCategoryTabs from './main-category-tabs'
import MobileNavigation from './mobile-navigation'
import NavigationTitle from './navigation-title'
import NestedCategories from './nested-categories'
import { PetNavigationMenuProps } from './api-types'

export default function PetNavigationMenu({ className }: PetNavigationMenuProps) {
  const { data: categories, isLoading, error } = useCategories()
  const [activeMainCategory, setActiveMainCategory] = useState<string>('')

  // Set initial active category when data loads
  if (categories && categories.length > 0 && !activeMainCategory) {
    setActiveMainCategory(categories[0].id)
  }

  const activeCategories = categories?.find(cat => cat.id === activeMainCategory)?.subcategories || []

  if (isLoading) {
    return (
      <div className={cn(
        'w-full bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700',
        className,
      )}>
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-500 dark:text-gray-400">Cargando categorías...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn(
        'w-full bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700',
        className,
      )}>
        <div className="flex items-center justify-center p-8">
          <div className="text-red-500">Error al cargar las categorías</div>
        </div>
      </div>
    )
  }

  if (!categories || categories.length === 0) {
    return (
      <div className={cn(
        'w-full bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700',
        className,
      )}>
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-500 dark:text-gray-400">No hay categorías disponibles</div>
        </div>
      </div>
    )
  }

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
        <MobileNavigation mainCategories={categories} />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        {/* First Level - Main Categories */}
        <MainCategoryTabs
          categories={categories}
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
