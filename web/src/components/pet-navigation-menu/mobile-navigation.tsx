'use client'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight, Menu } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { MainCategory } from './types'

interface MobileNavigationProps {
  mainCategories: MainCategory[]
}

export default function MobileNavigation({ mainCategories }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedMainCategory, setExpandedMainCategory] = useState<string>('shopping')
  const [expandedSubCategory, setExpandedSubCategory] = useState<string | null>(null)

  const toggleMainCategory = (categoryId: string) => {
    setExpandedMainCategory(expandedMainCategory === categoryId ? '' : categoryId)
    setExpandedSubCategory(null) // Close sub-categories when switching main categories
  }

  const toggleSubCategory = (categoryId: string) => {
    setExpandedSubCategory(expandedSubCategory === categoryId ? null : categoryId)
  }

  return (
    <div className="lg:hidden ml-auto">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="dark:text-white">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 dark:bg-gray-900 dark:border-gray-700">
          <SheetHeader>
            <SheetTitle className="text-left font-fredoka text-lg dark:text-white">
              Categorías
            </SheetTitle>
            <SheetDescription className="text-left font-lato dark:text-gray-400">
              Explora nuestros productos y servicios para mascotas
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="h-full mt-6">
            <div className="space-y-2 pb-20">
              {mainCategories.map((mainCategory) => (
                <div key={mainCategory.id} className="space-y-2">
                  {/* Main Category */}
                  <Button
                    variant="ghost"
                    onClick={() => toggleMainCategory(mainCategory.id)}
                    className="w-full justify-between p-3 h-auto dark:text-white dark:hover:bg-gray-800 hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{mainCategory.icon}</span>
                      <span className="font-fredoka font-bold text-base">{mainCategory.name}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        expandedMainCategory === mainCategory.id && 'rotate-180',
                      )}
                    />
                  </Button>

                  {/* Sub Categories */}
                  {expandedMainCategory === mainCategory.id && (
                    <div className="pl-6 space-y-1">
                      {mainCategory.subcategories.map((category) => (
                        <div key={category.id} className="space-y-1">
                          <Button
                            variant="ghost"
                            onClick={() => toggleSubCategory(category.id)}
                            className="w-full justify-between p-2 h-auto text-left dark:text-white dark:hover:bg-gray-800 hover:bg-gray-50"
                          >
                            <span className="font-fredoka font-medium text-sm">{category.name}</span>
                            {category.subcategories.length > 0 && (
                              <ChevronDown
                                className={cn(
                                  'h-3 w-3 transition-transform',
                                  expandedSubCategory === category.id && 'rotate-180',
                                )}
                              />
                            )}
                          </Button>

                          {/* Sub-sub categories */}
                          {expandedSubCategory === category.id && category.subcategories.length > 0 && (
                            <div className="pl-4 space-y-1">
                              <Link
                                href={category.href}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              >
                                <span className="text-xs font-fredoka font-medium text-primary dark:text-blue-400">
                                  Ver todo en {category.name}
                                </span>
                                <ChevronRight className="h-2 w-2 text-gray-400" />
                              </Link>

                              {category.subcategories.map((subcategory) => (
                                <Link
                                  key={subcategory.id}
                                  href={subcategory.href}
                                  onClick={() => setIsOpen(false)}
                                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                  <div>
                                    <span className="text-xs font-lato dark:text-gray-300">
                                      {subcategory.name}
                                    </span>
                                    {subcategory.count && (
                                      <p className="text-xs text-gray-500 font-lato dark:text-gray-400">
                                        {subcategory.count} productos
                                      </p>
                                    )}
                                  </div>
                                  <ChevronRight className="h-2 w-2 text-gray-400" />
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  )
}
